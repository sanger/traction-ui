import { defaultHeaders, createRequest } from '@/api/createRequest'
import axios from 'axios'

const attributes = {
  rootURL: 'http://traction',
  apiNamespace: 'v1',
  resource: 'requests',
  headers: {
    header1: 'header1',
    header2: 'header2',
  },
}

const mockAxios = jest.genMockFromModule('axios')

describe('createRequest', () => {
  describe('basic attributes', () => {
    it('will have a rootURL', () => {
      const request = createRequest({ ...attributes })
      expect(request.rootURL).toEqual(attributes.rootURL)
    })

    it('will have an api namespace', () => {
      const request = createRequest({ ...attributes })
      expect(request.apiNamespace).toEqual(attributes.apiNamespace)
    })

    it('will have a resource', () => {
      const request = createRequest({ ...attributes })
      expect(request.resource).toEqual(attributes.resource)
    })

    it('will have some headers', () => {
      const request = createRequest({ ...attributes })
      expect(request.headers).toEqual(attributes.headers)
    })

    it('will have some default headers if none were passed', () => {
      // eslint-disable-next-line no-unused-vars
      const { headers, ...rest } = attributes
      const request = createRequest({ ...rest })
      expect(request.headers).toEqual(defaultHeaders)
    })

    it('will have a base url', () => {
      const request = createRequest({ ...attributes })
      expect(request.baseURL).toEqual('http://traction/v1')
    })

    it('will have an api', () => {
      const request = createRequest({ ...attributes })
      expect(request.api).toBeDefined()
      const api = request.api
      expect(api.defaults.baseURL).toEqual(request.baseURL)
      const headerKeys = Object.keys(api.defaults.headers)
      expect(headerKeys.includes('header1')).toBeTruthy()
      expect(headerKeys.includes('header2')).toBeTruthy()
    })
  })

  describe('build filters', () => {
    it('singular', () => {
      const request = createRequest({ ...attributes })
      const filters = request.buildFilters({ a: '1' })
      expect(filters).toEqual('filter[a]=1')
    })

    it('multiple', () => {
      const request = createRequest({ ...attributes })
      const filters = request.buildFilters({ a: '1', b: '2' })
      expect(filters).toEqual('filter[a]=1&filter[b]=2')
    })

    it('empty', () => {
      const request = createRequest({ ...attributes })
      const filters = request.buildFilters()
      expect(filters).toEqual('')
    })
  })

  describe('build query', () => {
    it('no filters or includes', () => {
      const request = createRequest({ ...attributes })
      const query = request.buildQuery()
      expect(query).toEqual('requests')
    })

    it('filters no includes', () => {
      const request = createRequest({ ...attributes })
      const query = request.buildQuery({ filters: { a: '1', b: '2' } })
      expect(query).toEqual('requests?filter[a]=1&filter[b]=2')
    })

    it('includes no filters', () => {
      const request = createRequest({ ...attributes })
      const query = request.buildQuery({ include: 'sample.tube' })
      expect(query).toEqual('requests?include=sample.tube')
    })

    it('filters and includes', () => {
      const request = createRequest({ ...attributes })
      const query = request.buildQuery({ filters: { a: '1', b: '2' }, include: 'sample.tube' })
      expect(query).toEqual('requests?filter[a]=1&filter[b]=2&include=sample.tube')
    })
  })

  describe('api calls', () => {
    beforeEach(() => {
      axios.create = jest.fn(() => mockAxios)
    })

    it('get', async () => {
      const mockResponse = {
        status: 200,
        data: { data: [{ id: 1 }] },
      }
      mockAxios.get.mockReturnValue(mockResponse)
      const request = createRequest({ ...attributes })
      const response = await request.get()
      expect(mockAxios.get).toBeCalledWith(request.buildQuery())
      expect(response).toEqual(mockResponse)
    })

    it('create', async () => {
      const data = { id: 1 }
      const mockResponse = { data: { status: 201 } }
      mockAxios.post.mockReturnValue(mockResponse)
      const request = createRequest({ ...attributes })
      const response = await request.create({ data })
      expect(mockAxios.post).toBeCalledWith(request.resource, data)
      expect(response).toEqual(mockResponse)
    })

    describe.skip('update', () => {

    })

    describe.skip('delete', () => {
      
    })
  })
})
