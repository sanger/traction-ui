import {
  extractLocationsForLabwares,
  getCoordinateForLabware,
} from '@/services/labwhere/helpers.js'
import LabwhereLocationsFactory from '@tests/factories/LabwhereLocationsFactory.js'

describe('helpers', () => {
  const labwhereLocationsFactory = LabwhereLocationsFactory()

  describe('extractLocationsForLabwares', () => {
    it('should return an empty object when no labwares are provided', () => {
      const labwares = []
      const labwareBarcodes = ['ABC123']
      const result = extractLocationsForLabwares(labwares, labwareBarcodes)
      expect(result).toEqual({ ABC123: {} })
    })

    it('should return an empty object for barcodes not found in labwares', () => {
      const labwares = [{ barcode: 'XYZ789', location: labwhereLocationsFactory.content[0] }]
      const labwareBarcodes = ['ABC123']
      const result = extractLocationsForLabwares(labwares, labwareBarcodes)
      expect(result).toEqual({ ABC123: {} })
    })

    it('should return the correct location for a given barcode', () => {
      const labwares = [
        { barcode: 'ABC123', location: labwhereLocationsFactory.content[0] },
        { barcode: 'XYZ789', location: labwhereLocationsFactory.content[1] },
      ]
      const labwareBarcodes = ['ABC123']
      const result = extractLocationsForLabwares(labwares, labwareBarcodes)
      expect(result).toEqual({ ABC123: labwhereLocationsFactory.content[0] })
    })

    it('should return the correct locations for multiple barcodes', () => {
      const labwares = [
        { barcode: 'ABC123', location: labwhereLocationsFactory.content[0] },
        { barcode: 'XYZ789', location: labwhereLocationsFactory.content[1] },
      ]
      const labwareBarcodes = ['ABC123', 'XYZ789']
      const result = extractLocationsForLabwares(labwares, labwareBarcodes)
      expect(result).toEqual({
        ABC123: labwhereLocationsFactory.content[0],
        XYZ789: labwhereLocationsFactory.content[1],
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
      const location = labwhereLocationsFactory.content[0]
      const labwareBarcode = ''
      const result = getCoordinateForLabware(location, labwareBarcode)
      expect(result).toEqual({})
    })

    it('should return an empty object when the location has no coordinates', () => {
      const location = labwhereLocationsFactory.content[1]
      const labwareBarcode = 'ABC123'
      const result = getCoordinateForLabware(location, labwareBarcode)
      expect(result).toEqual({})
    })

    it('should return an empty object when the labware is not found in the location coordinates', () => {
      // Copy the object so we don't mutate the content for other tests
      const location = { ...labwhereLocationsFactory.content[0] }
      location.coordinates = [{ labware: 'XYZ789', row: 1, column: 2, position: 1 }]
      const labwareBarcode = 'ABC123'
      const result = getCoordinateForLabware(location, labwareBarcode)
      expect(result).toEqual({})
    })

    it('should return the correct coordinate for a given labware', () => {
      const location = labwhereLocationsFactory.content[0]
      const labwareBarcode = 'box-1'
      const result = getCoordinateForLabware(location, labwareBarcode)
      expect(result).toEqual(location.coordinates[0])
    })
  })
})
