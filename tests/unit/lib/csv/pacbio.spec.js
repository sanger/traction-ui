// @vitest-environment node
// This specifies that this file should be running using the node environment
// We need to do this because node-based csv-parse library used in 'eachRecord' doesn't work with jsdom

import fs from 'fs'
import { eachRecord } from '@/lib/csv/pacbio'

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
