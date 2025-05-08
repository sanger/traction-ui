import {
  getLabwhereLocations,
  getLabwhereLocationsV2,
  scanBarcodesInLabwhereLocation,
  scanBarcodesInLabwhereLocationV2,
  exhaustLibraryVolumeIfDestroyed,
} from '@/services/labwhere/client.js'
import * as pacbioLibraryUtilities from '@/stores/utilities/pacbioLibraries.js'
import * as pacbioLibraryService from '@/services/traction/PacbioLibrary.js'
import * as helpers from '@/services/labwhere/helpers.js'
import { createPinia, setActivePinia } from '@support/testHelper.js'
import { beforeEach, describe, it } from 'vitest'

const spyPost = vi.fn()
const mockFetchWrapper = {
  post: spyPost,
  baseUrl: 'http://test',
  serviceName: 'test',
}

describe('getLabwhereLocations', () => {
  let spyExtractLocations
  // beforeEach(() => {
  //   spyExtractLocations = vi.spyOn(helpers, 'extractLocationsForLabwares')
  // })

  it('should return an error if no barcodes are provided', async () => {
    const result = await getLabwhereLocations([], mockFetchWrapper)
    expect(result).toEqual({ success: false, errors: ['No barcodes provided'], data: {} })
  })

  it('should not call extractLocationsForLabwares if post fails', async () => {
    const response = {
      success: false,
      errors: ['Failed to access LabWhere: Network error'],
      data: {},
    }
    spyPost.mockReturnValue(response)
    const result = await getLabwhereLocations(['barcode1'], mockFetchWrapper)
    expect(result).toEqual(response)
    expect(spyExtractLocations).not.toHaveBeenCalled()
  })

  it('should call extractLocationsForLabwares if post succeeds', async () => {
    spyPost.mockReturnValue({ success: true })
    const data = [
      {
        barcode: 'barcode1',
        location: 'location1',
      },
      {
        barcode: 'barcode2',
        location: 'location2',
      },
    ]
    spyExtractLocations.mockReturnValue(data)
    const result = await getLabwhereLocations(['barcode1'], mockFetchWrapper)
    expect(result).toEqual({ success: true, data })
    expect(spyExtractLocations).toHaveBeenCalled()
  })
})

describe('getLabwhereLocationsV2', () => {
  let spyExtractLocations
  // beforeEach(() => {
  //   spyExtractLocations = vi.spyOn(helpers, 'extractLocationsForLabwares')
  // })

  it('should return an error if no barcodes are provided', async () => {
    const result = await getLabwhereLocationsV2([], mockFetchWrapper)
    expect(result).toEqual({ success: false, errors: ['No barcodes provided'], data: {} })
  })

  it('should not call extractLocationsForLabwares if post fails', async () => {
    const response = {
      success: false,
      errors: ['Failed to access LabWhere: Network error'],
      data: {},
    }
    spyPost.mockReturnValue(response)
    const result = await getLabwhereLocationsV2(['barcode1'], mockFetchWrapper)
    expect(result).toEqual(response)
    // expect(spyExtractLocations).not.toHaveBeenCalled()
  })

  it('should call extractLocationsForLabwares if post succeeds', async () => {
    spyPost.mockReturnValue({ success: true })
    const data = [
      {
        barcode: 'barcode1',
        location: 'location1',
      },
      {
        barcode: 'barcode2',
        location: 'location2',
      },
    ]
    // spyExtractLocations.mockReturnValue(data)
    const result = await getLabwhereLocationsV2(['barcode1'], mockFetchWrapper)
    expect(result).toEqual({ success: true, data })
    // expect(spyExtractLocations).toHaveBeenCalled()
  })

  it.only('should handle multiple barcodes correctly', async () => {
    spyPost.mockReturnValue({ success: true })
    const data = [
      {
        barcode: 'barcode1',
        location: 'location1',
      },
      {
        barcode: 'barcode2',
        location: 'location2',
      },
    ]
    // spyExtractLocations.mockReturnValue(data)
    const result = await getLabwhereLocationsV2(['barcode1', 'barcode2'], mockFetchWrapper)
    expect(result).toEqual({ success: true, data })
    // expect(spyExtractLocations).toHaveBeenCalledWith(expect.anything(), ['barcode1', 'barcode2'])
  })
})

describe('scanBarcodesInLabwhereLocation', () => {
  it('should return an error if required parameters are missing', async () => {
    const result = await scanBarcodesInLabwhereLocation('', '', '', null, mockFetchWrapper)
    expect(result).toEqual({
      success: false,
      errors: ['Required parameters are missing for the Scan In operation'],
    })
  })

  it('should return formatted result for post response', async () => {
    spyPost.mockResolvedValue({
      success: true,
      errors: [],
      data: { message: 'Labware stored to location 1' },
    })
    const result = await scanBarcodesInLabwhereLocation(
      'user123',
      'location123',
      'barcode1',
      null,
      mockFetchWrapper,
    )
    expect(spyPost).toHaveBeenCalledWith(
      '/api/scans',
      expect.any(String),
      'application/x-www-form-urlencoded',
    )
    const callArgs = spyPost.mock.calls[0]
    const params = new URLSearchParams(callArgs[1])
    expect(params.get('scan[start_position]')).toBe(null)
    expect(params.get('scan[user_code]')).toBe('user123')
    expect(params.get('scan[labware_barcodes]')).toBe('barcode1')
    expect(params.get('scan[location_barcode]')).toBe('location123')
    expect(result).toEqual({
      success: true,
      errors: [],
      message: 'Labware stored to location 1',
    })
  })

  it('should include start position if provided', async () => {
    spyPost.mockResolvedValue({ success: true, errors: [], data: { message: '' } })
    await scanBarcodesInLabwhereLocation('user123', 'location123', 'barcode1', 1, mockFetchWrapper)
    const callArgs = spyPost.mock.calls[0]
    const params = new URLSearchParams(callArgs[1])
    expect(params.get('scan[start_position]')).toBe('1')
  })
})

describe('scanBarcodesInLabwhereLocationV2', () => {
  it('should return an error if required parameters are missing', async () => {
    const result = await scanBarcodesInLabwhereLocationV2('', '', mockFetchWrapper)
    expect(result).toEqual({
      success: false,
      errors: ['Required parameters are missing for the Scan In operation'],
    })
  })

  it('should return formatted result for post response', async () => {
    spyPost.mockResolvedValue({
      success: true,
      errors: [],
      data: { message: '1 labwares scanned into location 1' },
    })
    const result = await scanBarcodesInLabwhereLocationV2(
      'location123',
      'barcode1\nbarcode2',
      mockFetchWrapper,
    )
    expect(spyPost).toHaveBeenCalledWith('/scan', {
      labware_barcodes: 'barcode1\nbarcode2',
      location_barcode: 'location123',
    })
    expect(result).toEqual({
      success: true,
      errors: [],
      message: '1 labwares scanned into location 1',
    })
  })
})

describe('exhaustLibraryVolumeIfDestroyed', () => {
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
    mockFetchLibraries = vi.fn()
    mockFormatAndTransformLibraries = vi.fn()
    mockExhaustLibrayVolume = vi.fn()
    mockFetchLibraries = vi.spyOn(pacbioLibraryService, 'getPacbioLibraryResources')
    mockFormatAndTransformLibraries = vi.spyOn(
      pacbioLibraryUtilities,
      'formatAndTransformLibraries',
    )
    mockExhaustLibrayVolume = vi.spyOn(pacbioLibraryUtilities, 'exhaustLibrayVolume')
  })

  it('should return false if locationBarcode does not match destroyLocation', async () => {
    const result = await exhaustLibraryVolumeIfDestroyed('wrong-location', labwareBarcodes)
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
      await exhaustLibraryVolumeIfDestroyed(destroyLocation, labwareBarcodes)
      expect(mockFetchLibraries).toHaveBeenCalledTimes(2)
      expect(mockFetchLibraries).toHaveBeenCalledWith({
        filter: { source_identifier: 'barcode1,barcode2,barcode3' },
      })
      expect(mockFetchLibraries).toHaveBeenCalledWith({ filter: { barcode: 'barcode2,barcode3' } })
    })
    it('should return exhaused libraries', async () => {
      const result = await exhaustLibraryVolumeIfDestroyed(destroyLocation, labwareBarcodes)
      expect(result).toEqual({ success: true, exhaustedLibraries: formattedLibraries })
    })

    it('should exhaust library volumes', async () => {
      await exhaustLibraryVolumeIfDestroyed(destroyLocation, labwareBarcodes)
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
      const result = await exhaustLibraryVolumeIfDestroyed(destroyLocation, labwareBarcodes)
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
      const result = await exhaustLibraryVolumeIfDestroyed(destroyLocation, labwareBarcodes)
      expect(result).toEqual({ success: false })
    })
  })
  describe('when exhaustLibrayVolume fails', () => {
    it('should return an empty array', async () => {
      mockFetchLibraries.mockResolvedValueOnce(fetchLibraryResponses[0])
      mockFormatAndTransformLibraries.mockReturnValueOnce([formattedLibraries[0]])
      mockExhaustLibrayVolume.mockResolvedValue({ success: false })
      const result = await exhaustLibraryVolumeIfDestroyed(destroyLocation, labwareBarcodes)
      expect(result).toEqual({ success: false, exhaustedLibraries: [] })
    })
    it('should not return libraries for which the exhaustLibrayVolume fails ', async () => {
      mockFetchLibraries.mockResolvedValueOnce(fetchLibraryResponses[0])
      mockFetchLibraries.mockResolvedValueOnce(fetchLibraryResponses[1])
      mockFormatAndTransformLibraries.mockReturnValueOnce([formattedLibraries[0]])
      mockFormatAndTransformLibraries.mockReturnValueOnce([formattedLibraries[1]])
      mockExhaustLibrayVolume.mockResolvedValueOnce({ success: true })
      mockExhaustLibrayVolume.mockResolvedValueOnce({ success: false })
      const result = await exhaustLibraryVolumeIfDestroyed(destroyLocation, labwareBarcodes)
      expect(result).toEqual({ success: true, exhaustedLibraries: [formattedLibraries[0]] })
    })
  })
})
