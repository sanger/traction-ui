import { vi } from 'vitest'
import {
  extractLocationsForLabwares,
  getCoordinateForLabware,
  locationBuilder,
  formatLocations,
} from '@/services/labwhere/helpers.js'
import LabwhereLocationsFactory from '@tests/factories/LabwhereLocationsFactory.js'

vi.mock('@/services/labwhere/client.js', () => ({
  getCoordinateForLabware: vi.fn(),
}))

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

  describe('locationBuilder', () => {
    it('should return an array with items having location as "-" when no locationsData is provided', () => {
      const items = [{ barcode: 'ABC123' }]
      const result = locationBuilder(items)
      expect(result).toEqual([{ barcode: 'ABC123', location: '-' }])
    })

    it('should return an array with items having location as "-" when no matching location is found', () => {
      const items = [{ barcode: 'ABC123' }]
      const locationsData = [
        { barcode: 'XYZ789', name: 'Location 1', coordinates: { row: 1, column: 2 } },
      ]
      const result = locationBuilder(items, locationsData)
      expect(result).toEqual([{ barcode: 'ABC123', location: '-' }])
    })

    it('should return an array with location name when location is found but has no coordinates', () => {
      const items = [{ barcode: 'ABC123' }]
      const locationsData = [{ barcode: 'ABC123', name: 'Location 1' }]
      const result = locationBuilder(items, locationsData)
      expect(result).toEqual([{ barcode: 'ABC123', location: 'Location 1' }])
    })

    it('should return an array with location name and coordinates when location is found with valid coordinates', () => {
      const items = [{ barcode: 'ABC123' }]
      const locationsData = [
        { barcode: 'ABC123', name: 'Location 1', coordinates: { row: 1, column: 2 } },
      ]
      const result = locationBuilder(items, locationsData)
      expect(result).toEqual([{ barcode: 'ABC123', location: 'Location 1 - 1, 2' }])
    })

    it('should return an array with location name when coordinates object is empty', () => {
      const items = [{ barcode: 'ABC123' }]
      const locationsData = [{ barcode: 'ABC123', name: 'Location 1', coordinates: {} }]
      const result = locationBuilder(items, locationsData)
      expect(result).toEqual([{ barcode: 'ABC123', location: 'Location 1' }])
    })

    it('should match item based on source_identifier if barcode is not present', () => {
      const items = [{ source_identifier: 'ABC123' }]
      const locationsData = [
        { barcode: 'ABC123', name: 'Location 1', coordinates: { row: 1, column: 2 } },
      ]
      const result = locationBuilder(items, locationsData)
      expect(result).toEqual([{ source_identifier: 'ABC123', location: 'Location 1 - 1, 2' }])
    })
  })

  describe('formatLocations', () => {
    it('sets default name "-" if name is missing', async () => {
      const locationData = { data: { ABC123: { coordinates: [{ row: 1, column: 2 }] } } }
      const result = await formatLocations(locationData)
      expect(result[0].name).toEqual('-')
    })

    it('sets coordinates to empty array if not provided', async () => {
      const locationData = { data: { ABC123: { name: 'Location 1' } } }
      const result = await formatLocations(locationData)
      expect(result[0].coordinates).toEqual({})
    })

    it('should return locations with valid coordinates when provided', async () => {
      const location = labwhereLocationsFactory.content[0]
      const labwareBarcode = 'box-1'

      const expectedCoordinates = location.coordinates[0]
      const locationData = {
        data: {
          [labwareBarcode]: { name: location.name, coordinates: [expectedCoordinates] },
        },
      }

      const result = await formatLocations(locationData)

      expect(result[0].coordinates).toEqual(expectedCoordinates)
    })
  })
})
