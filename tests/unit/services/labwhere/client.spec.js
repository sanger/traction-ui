import {
  getLabwhereLocations,
  scanBarcodesInLabwhereLocation,
  exhaustSamplesIfDestroyed,
} from '@/services/labwhere/client.js'
import LabwhereLocationsFactory from '@tests/factories/LabwhereLocationsFactory.js'
import * as pacbioLibraryUtilities from '@/stores/utilities/pacbioLibraries.js'
import { createPinia, setActivePinia } from '@support/testHelper.js'
import { beforeEach, describe, it } from 'vitest'
const mockFetch = vi.fn()
const labwhereLocationsFactory = LabwhereLocationsFactory()

beforeEach(() => {
  global.fetch = mockFetch
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('getLabwhereLocations', () => {
  it('should return an error if no barcodes are provided', async () => {
    const result = await getLabwhereLocations([])
    expect(result).toEqual({ success: false, errors: ['No barcodes provided'], data: {} })
  })

  it('should return an error if fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))
    const result = await getLabwhereLocations(['barcode1'])
    expect(result).toEqual({
      success: false,
      errors: ['Failed to access LabWhere: Network error'],
      data: {},
    })
  })

  it('should return an error if response is not ok', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ errors: ['Some error'] }),
    })
    const result = await getLabwhereLocations(['barcode1'])
    expect(result).toEqual({ success: false, errors: ['Some error'], data: {} })
  })

  it('should return locations if fetch is successful', async () => {
    const mockResponse = [
      {
        barcode: 'barcode1',
        location: labwhereLocationsFactory.content[0],
      },
      {
        barcode: 'barcode2',
        location: labwhereLocationsFactory.content[1],
      },
    ]
    const expectedData = {
      barcode1: mockResponse[0].location,
      barcode2: mockResponse[1].location,
      barcode3: {},
    }
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await getLabwhereLocations(['barcode1', 'barcode2', 'barcode3'])
    expect(result).toEqual({ success: true, errors: [], data: expectedData })
  })
})
describe('scanBarcodesInLabwhereLocation', () => {
  it('should return an error if required parameters are missing', async () => {
    const result = await scanBarcodesInLabwhereLocation('', '', '', null)
    expect(result).toEqual({
      success: false,
      errors: ['Required parameters are missing for the Scan In operation'],
    })
  })

  it('should return an error if fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))
    const result = await scanBarcodesInLabwhereLocation('user123', 'location123', 'barcode1', null)
    expect(result).toEqual({
      success: false,
      errors: ['Failed to access LabWhere: Network error'],
    })
  })

  it('should return an error if response is not ok', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ errors: ['Some error'] }),
    })
    const result = await scanBarcodesInLabwhereLocation('user123', 'location123', 'barcode1', null)
    expect(result).toEqual({ success: false, errors: ['Some error'] })
  })

  it('should return success if fetch is successful', async () => {
    const mockResponse = { success: true, errors: [], message: 'Labware stored to location 1' }
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await scanBarcodesInLabwhereLocation('user123', 'location123', 'barcode1', null)
    expect(result).toEqual(mockResponse)
  })

  it('should include start position if provided', async () => {
    const mockResponse = { success: true, errors: [] }
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await scanBarcodesInLabwhereLocation('user123', 'location123', 'barcode1', 1)
    expect(result).toEqual(mockResponse)
  })
})

describe('exhaustSamplesIfDestroyed', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })
  const destroyLocation = import.meta.env['VITE_DESTROYED_LOCATION_BARCODE']
  const labwareBarcodes = ['barcode1', 'barcode2', 'barcode3']
  let mockFetchLibraries, mockFormatAndTransformLibraries, mockExhaustLibrayVolume
  const fetchLibraryResponses = [
    {
      success: true,
      libraries: [{ id: 1, source_identifier: 'barcode1', tube: 1 }],
      tubes: {},
      tags: {},
      requests: {},
    },
    {
      success: true,
      libraries: [
        { id: 2, barcode: 'barcode2', tube: 2 },
        { id: 3, barcode: 'barcode3', tube: 3 },
      ],
      tubes: {},
      tags: {},
      requests: {},
    },
  ]
  const formattedLibraries = [
    { id: 1, source_identifier: 'barcode1', barcode: 'TRAC-1' },
    { id: 2, source_identifier: 'barcode2', barcode: 'TRAC-2' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    // Mock the environment variable
    import.meta.env = { VITE_DESTROYED_LOCATION_BARCODE: destroyLocation }
    mockFetchLibraries = vi.fn()
    mockFormatAndTransformLibraries = vi.fn()
    mockExhaustLibrayVolume = vi.fn()
    mockFetchLibraries = vi.spyOn(pacbioLibraryUtilities, 'fetchLibraries')
    mockFormatAndTransformLibraries = vi.spyOn(
      pacbioLibraryUtilities,
      'formatAndTransformLibraries',
    )
    mockExhaustLibrayVolume = vi.spyOn(pacbioLibraryUtilities, 'exhaustLibrayVolume')
  })

  it('should return false if locationBarcode does not match destroyLocation', async () => {
    const result = await exhaustSamplesIfDestroyed('wrong-location', labwareBarcodes)
    expect(mockFetchLibraries).not.toHaveBeenCalled()
    expect(result).toEqual({ success: false })
  })

  describe('when succesfully fetching libraries', () => {
    beforeEach(() => {
      mockFetchLibraries.mockResolvedValueOnce(fetchLibraryResponses[0])
      mockFetchLibraries.mockResolvedValueOnce(fetchLibraryResponses[1])
      mockFormatAndTransformLibraries.mockReturnValueOnce([formattedLibraries[0]])
      mockFormatAndTransformLibraries.mockReturnValueOnce([formattedLibraries[1]])
      mockExhaustLibrayVolume.mockResolvedValue({ success: true })
    })
    it('should fetch libraries by source_identifier and barcode', async () => {
      await exhaustSamplesIfDestroyed(destroyLocation, labwareBarcodes)
      expect(mockFetchLibraries).toHaveBeenCalledTimes(2)
      expect(mockFetchLibraries).toHaveBeenCalledWith({
        filter: { source_identifier: 'barcode1,barcode2,barcode3' },
      })
      expect(mockFetchLibraries).toHaveBeenCalledWith({ filter: { barcode: 'barcode2,barcode3' } })
    })
    it('should return exhaused libraries', async () => {
      const result = await exhaustSamplesIfDestroyed(destroyLocation, labwareBarcodes)
      expect(result).toEqual({success: true, exhaustedLibraries:formattedLibraries})
    })

    it('should exhaust library volumes', async () => {
      await exhaustSamplesIfDestroyed(destroyLocation, labwareBarcodes)
      expect(mockExhaustLibrayVolume).toHaveBeenCalledTimes(2)
      expect(mockExhaustLibrayVolume).toHaveBeenCalledWith(formattedLibraries[0])
      expect(mockExhaustLibrayVolume).toHaveBeenCalledWith(formattedLibraries[1])
    })
  })
  describe('when fetching libraries fails', () => {
    beforeEach(() => {
      mockFetchLibraries.mockResolvedValueOnce({ success: false })
    })
    it('should return an empty array', async () => {
      const result = await exhaustSamplesIfDestroyed(destroyLocation, labwareBarcodes)
      expect(result).toEqual({ success: false })
      expect(mockExhaustLibrayVolume).not.toHaveBeenCalled()
    })
  })
  describe('when formatAndTransformLibraries returns an empty array', () => {
    beforeEach(() => {
      mockFetchLibraries.mockResolvedValueOnce(fetchLibraryResponses[0])
      mockFormatAndTransformLibraries.mockReturnValueOnce([])
    })
    it('should return an empty array', async () => {
      const result = await exhaustSamplesIfDestroyed(destroyLocation, labwareBarcodes)
      expect(result).toEqual({success: false})
    })
  })
  describe('when exhaustLibrayVolume fails', () => {
    it('should return an empty array', async () => {
      mockFetchLibraries.mockResolvedValueOnce(fetchLibraryResponses[0])
      mockFormatAndTransformLibraries.mockReturnValueOnce([formattedLibraries[0]])
      mockExhaustLibrayVolume.mockResolvedValue({ success: false })
      const result = await exhaustSamplesIfDestroyed(destroyLocation, labwareBarcodes)
      expect(result).toEqual({success:false, exhaustedLibraries: []})
    })
    it('should not return libraries for which the exhaustLibrayVolume fails ', async () => {
      mockFetchLibraries.mockResolvedValueOnce(fetchLibraryResponses[0])
      mockFetchLibraries.mockResolvedValueOnce(fetchLibraryResponses[1])
      mockFormatAndTransformLibraries.mockReturnValueOnce([formattedLibraries[0]])
      mockFormatAndTransformLibraries.mockReturnValueOnce([formattedLibraries[1]])
      mockExhaustLibrayVolume.mockResolvedValueOnce({ success: true })
      mockExhaustLibrayVolume.mockResolvedValueOnce({ success: false })
      const result = await exhaustSamplesIfDestroyed(destroyLocation, labwareBarcodes)
      expect(result).toEqual({success:true, exhaustedLibraries: [formattedLibraries[0]]})
    })
  })
})
