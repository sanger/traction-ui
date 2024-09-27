import {
  extractLocationsForLabwares,
  getCoordinateForLabware,
} from '@/services/labwhere/helpers.js'

describe('helpers', () => {
  describe('extractLocationsForLabwares', () => {
    it('should return an empty object when no labwares are provided', () => {
      const labwares = []
      const labwareBarcodes = ['ABC123']
      const result = extractLocationsForLabwares(labwares, labwareBarcodes)
      expect(result).toEqual({ ABC123: {} })
    })

    it('should return an empty object for barcodes not found in labwares', () => {
      const labwares = [{ barcode: 'XYZ789', location: { id: 1, name: 'location-1' } }]
      const labwareBarcodes = ['ABC123']
      const result = extractLocationsForLabwares(labwares, labwareBarcodes)
      expect(result).toEqual({ ABC123: {} })
    })

    it('should return the correct location for a given barcode', () => {
      const labwares = [
        { barcode: 'ABC123', location: { id: 1, name: 'location-1' } },
        { barcode: 'XYZ789', location: { id: 2, name: 'location-2' } },
      ]
      const labwareBarcodes = ['ABC123']
      const result = extractLocationsForLabwares(labwares, labwareBarcodes)
      expect(result).toEqual({ ABC123: { id: 1, name: 'location-1' } })
    })

    it('should return the correct locations for multiple barcodes', () => {
      const labwares = [
        { barcode: 'ABC123', location: { id: 1, name: 'location-1' } },
        { barcode: 'XYZ789', location: { id: 2, name: 'location-2' } },
      ]
      const labwareBarcodes = ['ABC123', 'XYZ789']
      const result = extractLocationsForLabwares(labwares, labwareBarcodes)
      expect(result).toEqual({
        ABC123: { id: 1, name: 'location-1' },
        XYZ789: { id: 2, name: 'location-2' },
      })
    })
  })

  describe('getCoordinateForLabware', () => {
    it('should return an empty object when no location is provided', () => {
      const location = {}
      const labwareBarcode = 'ABC123'
      const result = getCoordinateForLabware(location, labwareBarcode)
      expect(result).toEqual({})
    })

    it('should return an empty object when no labware barcode is provided', () => {
      const location = {
        id: 1,
        barcode: 'location-1',
        coordinates: [{ labware: 'XYZ789', row: 1, column: 2, position: 1 }],
      }
      const labwareBarcode = ''
      const result = getCoordinateForLabware(location, labwareBarcode)
      expect(result).toEqual({})
    })

    it('should return an empty object when the location has no coordinates', () => {
      const location = { id: 1, barcode: 'location-1', coordinates: [] }
      const labwareBarcode = 'ABC123'
      const result = getCoordinateForLabware(location, labwareBarcode)
      expect(result).toEqual({})
    })

    it('should return an empty object when the labware is not found in the location coordinates', () => {
      const location = {
        id: 1,
        barcode: 'location-1',
        coordinates: [{ labware: 'XYZ789', row: 1, column: 2, position: 1 }],
      }
      const labwareBarcode = 'ABC123'
      const result = getCoordinateForLabware(location, labwareBarcode)
      expect(result).toEqual({})
    })

    it('should return the correct coordinate for a given labware', () => {
      const location = {
        id: 1,
        barcode: 'location-1',
        coordinates: [{ labware: 'XYZ789', row: 1, column: 2, position: 1 }],
      }
      const labwareBarcode = 'XYZ789'
      const result = getCoordinateForLabware(location, labwareBarcode)
      expect(result).toEqual({ labware: 'XYZ789', row: 1, column: 2, position: 1 })
    })
  })
})
