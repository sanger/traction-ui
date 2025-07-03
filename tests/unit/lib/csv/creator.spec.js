import { arrayToCsv } from '@/lib/csv/creator'

describe('arrayToCsv', () => {
  it('converts a simple 2D array to CSV', () => {
    const data = [
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ]
    const csv = arrayToCsv(data)
    expect(csv).toBe('"a","b","c"\r\n"1","2","3"')
  })

  it('escapes double quotes in values', () => {
    const data = [
      ['a', 'b"b', 'c'],
      ['1', '2', '3"3'],
    ]
    const csv = arrayToCsv(data)
    expect(csv).toBe('"a","b""b","c"\r\n"1","2","3""3"')
  })

  it('handles numbers and booleans', () => {
    const data = [
      [1, true, false],
      [2.5, null, undefined],
    ]
    const csv = arrayToCsv(data)
    expect(csv).toBe('"1","true","false"\r\n"2.5","null","undefined"')
  })

  it('handles empty arrays', () => {
    expect(arrayToCsv([])).toBe('')
  })

  it('handles rows with empty strings', () => {
    const data = [
      ['', '', ''],
      ['a', '', 'c'],
    ]
    const csv = arrayToCsv(data)
    expect(csv).toBe('"","",""\r\n"a","","c"')
  })
})
