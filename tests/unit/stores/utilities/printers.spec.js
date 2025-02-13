import { getPrintersOfType } from '@/stores/utilities/printers.js'

describe('getPrintersOfType', () => {
  it('returns printers of the specified labware type', () => {
    const printers = [
      { id: 1, name: 'Printer 1', labware_type: 'tube' },
      { id: 2, name: 'Printer 2', labware_type: 'plate' },
      { id: 3, name: 'Printer 3', labware_type: 'tube' },
    ]
    const printLabelType = 'tube'
    const expected = [
      { id: 1, name: 'Printer 1', labware_type: 'tube' },
      { id: 3, name: 'Printer 3', labware_type: 'tube' },
    ]

    const result = getPrintersOfType(printers, printLabelType)
    expect(result).toEqual(expected)
  })

  it('returns an empty array if no printers match the specified labware type', () => {
    const printers = [
      { id: 1, name: 'Printer 1', labware_type: 'tube' },
      { id: 2, name: 'Printer 2', labware_type: 'plate' },
    ]
    const printLabelType = 'slide'
    const expected = []

    const result = getPrintersOfType(printers, printLabelType)
    expect(result).toEqual(expected)
  })
})
