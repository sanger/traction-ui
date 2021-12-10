import fs from 'fs'

import { eachRecord } from '@/lib/csv/pacbio'

describe('eachRecord', () => {
  it('yields the expected records', () => {
    const csv = fs.readFileSync('./tests/data/csv/pacbio.csv', 'utf8')
    const callback = jest.fn()

    eachRecord(csv, callback)
    expect(callback).toHaveBeenCalledTimes(5)
    expect(callback).toHaveBeenCalledWith(
      {
        source: 'DN814597W-A10',
        tag: 'bc1059T',
        genome_size: 6.3,
        insert_size: 15230,
        concentration: 13,
        volume: 15,
      },
      // forEach yields the index, and the full array. We don't care about either
      expect.anything(),
      expect.anything(),
    )
    expect(callback).toHaveBeenCalledWith(
      {
        source: 'DN814597W-E10',
        tag: 'bc1064T',
        genome_size: 6.1,
        insert_size: 13681,
        concentration: 11.2,
        volume: 15,
      },
      expect.anything(),
      expect.anything(),
    )
  })

  it('handles empty columns', () => {
    const csv = fs.readFileSync('./tests/data/csv/pacbio-empty.csv', 'utf8')
    const callback = jest.fn()
    eachRecord(csv, callback)
    expect(callback).toHaveBeenCalledTimes(5)
    expect(callback).toHaveBeenCalledWith(
      {
        source: 'DN814597W-A10',
        genome_size: 6.3,
        insert_size: 15230,
        concentration: 13,
        volume: 15,
      },
      // forEach yields the index, and the full array. We don't care about either
      expect.anything(),
      expect.anything(),
    )
    expect(callback).toHaveBeenCalledWith(
      {
        source: 'DN814597W-E10',
        tag: 'bc1064T',
      },
      expect.anything(),
      expect.anything(),
    )
  })

  it('throws an exception if source column is missing', () => {
    const csv = fs.readFileSync('./tests/data/csv/pacbio-missing-source.csv', 'utf8')
    const callback = jest.fn()
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
})
