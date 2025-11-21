// @vitest-environment node
// This specifies that this file should be running using the node environment
// We need to do this because node-based csv-parse library used in 'eachRecord' doesn't work with jsdom

import fs from 'fs'
import { eachRecord, getColumnValues, removeEmptyLines } from '@/lib/csv/pacbio'

describe('eachRecord', () => {
  it('handles empty CSV data', () => {
    const csv = ''
    const callback = vi.fn()
    eachRecord(csv, callback)
    expect(callback).not.toHaveBeenCalled()
  })

  it('handles CSV data with only headers', () => {
    const csv = 'source,tag,genome_size,insert_size,concentration,volume\n'
    const callback = vi.fn()
    eachRecord(csv, callback)
    expect(callback).not.toHaveBeenCalled()
  })

  it('yields the expected records', () => {
    const csv = fs.readFileSync('./tests/data/csv/pacbio.csv', 'utf8')
    const callback = vi.fn()

    eachRecord(csv, callback)
    expect(callback).toHaveBeenCalledTimes(5)
    expect(callback).toHaveBeenCalledWith({
      record: {
        source: 'DN814597W:A10',
        tag: 'bc1059T',
        genome_size: 6.3,
        insert_size: 15230,
        concentration: 13,
        volume: 15,
      },
      info: expect.objectContaining({ lines: 2 }),
    })
    expect(callback).toHaveBeenCalledWith({
      record: {
        source: 'DN814597W:E10',
        tag: 'bc1064T',
        genome_size: 6.1,
        insert_size: 13681,
        concentration: 11.2,
        volume: 15,
      },
      info: expect.objectContaining({ lines: 6 }),
    })
  })

  it('handles empty columns', () => {
    const csv = fs.readFileSync('./tests/data/csv/pacbio-empty.csv', 'utf8')
    const callback = vi.fn()
    eachRecord(csv, callback)
    expect(callback).toHaveBeenCalledTimes(5)
    expect(callback).toHaveBeenCalledWith({
      record: {
        source: 'DN814597W:A10',
        genome_size: 6.3,
        insert_size: 15230,
        concentration: 13,
        volume: 15,
      },
      info: expect.objectContaining({ lines: 2 }),
    })
    expect(callback).toHaveBeenCalledWith({
      record: {
        source: 'DN814597W:E10',
        tag: 'bc1064T',
      },
      info: expect.objectContaining({ lines: 6 }),
    })
  })

  it('throws an exception if source column is missing', () => {
    const csv = fs.readFileSync('./tests/data/csv/pacbio-missing-source.csv', 'utf8')
    const callback = vi.fn()
    let thrownErrorMessage
    try {
      eachRecord(csv, callback)
    } catch (error) {
      thrownErrorMessage = String(error)
    }
    expect(callback).not.toHaveBeenCalled()
    expect(thrownErrorMessage).toEqual(
      "Could not find a 'source' header in tag,genome_size,insert_size,concentration,volume",
    )
  })

  it('does not validate headers when isValidateHeaders is false', () => {
    const csv =
      'sample_name,tag,genome_size,insert_size,concentration,volume\nDN814597W:A10,bc1059T,6.3,15230,13,15\n'
    const callback = vi.fn()
    let thrownErrorMessage
    try {
      eachRecord(csv, callback, false)
    } catch (error) {
      thrownErrorMessage = String(error)
    }
    expect(callback).toHaveBeenCalledTimes(1)
    expect(thrownErrorMessage).toBeUndefined()
  })

  it('processes each record and returns the results provided by the callback function', () => {
    const csv = fs.readFileSync('./tests/data/csv/pacbio.csv', 'utf8')
    const callback = vi.fn().mockReturnValue('some value')
    const results = eachRecord(csv, callback)
    expect(results).to.satisfy((entries) => entries.every((entry) => entry.result === 'some value'))
  })
  it('returns error if any record return error', () => {
    const csv = fs.readFileSync('./tests/data/csv/pacbio.csv', 'utf8')
    const callback = vi.fn().mockReturnValue(new Error('some error'))
    const result = eachRecord(csv, callback)
    expect(result.error).toEqual('some error')
  })
})
describe('getColumnValues', () => {
  it('returns an empty array for empty CSV data', () => {
    const csv = ''
    const result = getColumnValues(csv, 0)
    expect(result).toEqual([])
  })

  it('returns an empty array for CSV data with only headers', () => {
    const csv = 'header1,header2,header3\n'
    const result = getColumnValues(csv, 0)
    expect(result).toEqual([])
  })

  it('returns the correct column values when CSV has headers', () => {
    const csv = 'header1,header2,header3\nvalue1,value2,value3\nvalue4,value5,value6'
    const result = getColumnValues(csv, 1)
    expect(result).toEqual(['value2', 'value5'])
  })

  it('returns the correct column values when CSV does not have headers', () => {
    const csv = 'value1,value2,value3\nvalue4,value5,value6'
    const result = getColumnValues(csv, 1, false)
    expect(result).toEqual(['value2', 'value5'])
  })

  it('handles empty columns correctly', () => {
    const csv = 'header1,header2,header3\nvalue1,,value3\nvalue4,value5,'
    const result = getColumnValues(csv, 1)
    expect(result).toEqual(['', 'value5'])
  })
})
describe('removeEmptyLines', () => {
  it('removes empty lines from CSV data', () => {
    const csv = 'header1,header2,header3\n\nvalue1,value2,value3\n\nvalue4,value5,value6\n,,,,\n'
    const result = removeEmptyLines(csv)
    expect(result).toEqual('header1,header2,header3\nvalue1,value2,value3\nvalue4,value5,value6')
  })

  it('returns an empty string when CSV data is empty', () => {
    const csv = ''
    const result1 = removeEmptyLines(csv)
    expect(result1).toEqual('')
  })

  it('returns the same CSV data when there are no empty lines', () => {
    const csv = 'header1,header2,header3\nvalue1,value2,value3\nvalue4,value5,value6'
    const result = removeEmptyLines(csv)
    expect(result).toEqual(csv)
  })
})
