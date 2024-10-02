import { getLabwhereLocations } from '@/services/labwhere/client.js'
import LabwhereLocationsFactory from '@tests/factories/LabwhereLocationsFactory.js'

describe('getLabwhereLocations', () => {
  const mockFetch = vi.fn()
  const labwhereLocationsFactory = LabwhereLocationsFactory()

  beforeEach(() => {
    global.fetch = mockFetch
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

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