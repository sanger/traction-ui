import { extractLocationsForLabwares } from '@/services/labwhere/helpers.js'

describe('extractLocationsForLabwares', () => {
  it('should return an empty object when no labwares are provided', () => {
    const labwares = []
    const labwhereBarcodes = ['ABC123']
    const result = extractLocationsForLabwares(labwares, labwhereBarcodes)
    expect(result).toEqual({ ABC123: {} })
  })

  it('should return an empty object for barcodes not found in labwares', () => {
    const labwares = [{ barcode: 'XYZ789', location: { id: 1, name: 'location-1' } }]
    const labwhereBarcodes = ['ABC123']
    const result = extractLocationsForLabwares(labwares, labwhereBarcodes)
    expect(result).toEqual({ ABC123: {} })
  })

  it('should return the correct location for a given barcode', () => {
    const labwares = [
      { barcode: 'ABC123', location: { id: 1, name: 'location-1' } },
      { barcode: 'XYZ789', location: { id: 2, name: 'location-2' } },
    ]
    const labwhereBarcodes = ['ABC123']
    const result = extractLocationsForLabwares(labwares, labwhereBarcodes)
    expect(result).toEqual({ ABC123: { id: 1, name: 'location-1' } })
  })

  it('should return the correct locations for multiple barcodes', () => {
    const labwares = [
      { barcode: 'ABC123', location: { id: 1, name: 'location-1' } },
      { barcode: 'XYZ789', location: { id: 2, name: 'location-2' } },
    ]
    const labwhereBarcodes = ['ABC123', 'XYZ789']
    const result = extractLocationsForLabwares(labwares, labwhereBarcodes)
    expect(result).toEqual({
      ABC123: { id: 1, name: 'location-1' },
      XYZ789: { id: 2, name: 'location-2' },
    })
  })
})
