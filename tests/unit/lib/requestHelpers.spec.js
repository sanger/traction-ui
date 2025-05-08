import { formatRequests } from '@/lib/requestHelpers.js'

describe('formatRequests', () => {
  it('formats requests with humanized sample_retention_instruction', () => {
    const requests = [
      { id: 1, sample_retention_instruction: 'return_to_customer_after_2_years', barcode: 'BC123' },
      { id: 2, sample_retention_instruction: 'long_term_storage', barcode: 'BC124' },
      { id: 3, sample_retention_instruction: null, barcode: 'BC125' },
    ]

    const labwareLocation = [
      {
        barcode: 'BC123',
        name: 'Lab A',
        coordinates: { row: '1', column: 'A' },
      },
      {
        barcode: 'BC124',
        name: 'Lab B',
        coordinates: { row: '2', column: 'B' },
      },
      {
        barcode: 'BC126',
        name: 'Lab C',
        coordinates: {}, // No coordinates
      },
    ]

    // Call the actual formatRequests function
    const result = formatRequests(requests, labwareLocation)

    expect(result).toEqual([
      {
        id: 1,
        sample_retention_instruction: 'Return to customer after 2 years',
        barcode: 'BC123',
        location: 'Lab A - 1, A',
      },
      {
        id: 2,
        sample_retention_instruction: 'Long term storage',
        barcode: 'BC124',
        location: 'Lab B - 2, B',
      },
      {
        id: 3,
        sample_retention_instruction: '-',
        barcode: 'BC125',
        location: '-',
      },
    ])
  })
})
