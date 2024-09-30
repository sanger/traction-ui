import { FetchWrapper } from '@/api/FetchWrapper.js'

describe('FetchWrapper', () => {
  const baseUrl = 'http://api.example.com'
  const serviceName = 'ExampleService'
  const fetchWrapper = new FetchWrapper(baseUrl, serviceName)

  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should send a POST request and return success response', async () => {
    const endpoint = '/test-endpoint'
    const body = JSON.stringify({ key: 'value' })
    const mockResponse = { data: 'test data' }

    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await fetchWrapper.post(endpoint, body)

    expect(global.fetch).toHaveBeenCalledWith(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    expect(result).toEqual({ success: true, errors: [], data: mockResponse })
  })

  it('should return error response when fetch fails', async () => {
    const endpoint = '/test-endpoint'
    const body = JSON.stringify({ key: 'value' })
    const mockError = new Error('Network error')

    global.fetch.mockRejectedValue(mockError)

    const result = await fetchWrapper.post(endpoint, body)

    expect(global.fetch).toHaveBeenCalledWith(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    expect(result).toEqual({
      success: false,
      errors: [`Failed to access ${serviceName}: ${mockError.message}`],
      data: {},
    })
  })

  it('should return error response when server responds with error', async () => {
    const endpoint = '/test-endpoint'
    const body = JSON.stringify({ key: 'value' })
    const mockResponse = { errors: ['Server error'] }

    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => mockResponse,
    })

    const result = await fetchWrapper.post(endpoint, body)

    expect(global.fetch).toHaveBeenCalledWith(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    expect(result).toEqual({
      success: false,
      errors: mockResponse.errors,
      data: {},
    })
  })

  it('should return default error message when server responds with error without errors array', async () => {
    const endpoint = '/test-endpoint'
    const body = JSON.stringify({ key: 'value' })
    const mockResponse = {}

    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => mockResponse,
    })

    const result = await fetchWrapper.post(endpoint, body)

    expect(global.fetch).toHaveBeenCalledWith(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    })
    expect(result).toEqual({
      success: false,
      errors: ['An error occurred'],
      data: {},
    })
  })
})
