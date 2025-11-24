import {
  defaultHeaders,
  createRequest,
  createBasicRequest,
  QueryParametersType,
  RequestType,
} from '@/api/createRequest.js'

import { describe, expect } from 'vitest'

global.fetch = vi.fn()

const attributes = {
  rootURL: 'http://traction',
  apiNamespace: 'v1',
  resource: 'requests',
  path: 'my/url',
  headers: {
    header1: 'header1',
    header2: 'header2',
  },
}

const mockResponse = {
  status: 200,
  data: [{ id: 1 }],
}

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
      expect(request.api.headers).toEqual({ ...defaultHeaders.jsonApi, ...attributes.headers })
    })

    it('will have some default headers if none were passed', () => {
      // eslint-disable-next-line no-unused-vars
      const { headers, ...rest } = attributes
      const request = createRequest({ ...rest })
      expect(request.api.headers).toEqual(defaultHeaders.jsonApi)
    })

    it('will have a base url', () => {
      const request = createRequest({ ...attributes })
      expect(request.baseURL).toEqual('http://traction/v1')
    })

    it('will have an api', () => {
      const request = createRequest({ ...attributes })
      expect(request.api).toBeDefined()
      const api = request.api
      expect(api.baseURL).toEqual(request.baseURL)
      const headerKeys = Object.keys(api.headers)
      expect(headerKeys.includes('header1')).toBeTruthy()
      expect(headerKeys.includes('header2')).toBeTruthy()
    })
  })

  describe('build query', () => {
    it('no filters, includes or fields', () => {
      const request = createRequest({ ...attributes })
      const query = request.buildQuery(QueryParametersType())
      expect(query).toEqual('')
    })

    it('filter', () => {
      const request = createRequest({ ...attributes })
      const queryParametersType = QueryParametersType({ filter: { a: '1', b: '2' } })
      const query = request.buildQuery(queryParametersType)
      expect(query).toEqual('?filter[a]=1&filter[b]=2')
    })

    it('include', () => {
      const request = createRequest({ ...attributes })
      const queryParametersType = QueryParametersType({ include: 'sample.tube' })
      const query = request.buildQuery(queryParametersType)
      expect(query).toEqual('?include=sample.tube')
    })

    it('fields', () => {
      const request = createRequest({ ...attributes })
      const queryParametersType = QueryParametersType({
        fields: { resource1: 'field1', resource2: 'field2' },
      })
      const query = request.buildQuery(queryParametersType)
      expect(query).toEqual('?fields[resource1]=field1&fields[resource2]=field2')
    })

    it('filter, include and fields', () => {
      const request = createRequest({ ...attributes })
      const queryParametersType = QueryParametersType({
        filter: { a: '1', b: '2' },
        include: 'sample.tube',
        fields: { resource1: 'field1', resource2: 'field2' },
      })
      const query = request.buildQuery(queryParametersType)
      expect(query).toEqual(
        '?filter[a]=1&filter[b]=2&include=sample.tube&fields[resource1]=field1&fields[resource2]=field2',
      )
    })

    describe('if any arguments are not a string or an object', () => {
      it('when one of the values is not a string', () => {
        const request = createRequest({ ...attributes })
        const queryParametersType = QueryParametersType({ filter: { a: 1, b: 2 } })
        expect(() => {
          request.buildQuery(queryParametersType)
        }).toThrowError(new TypeError('query arguments are not of the correct type'))
      })

      it('when one of the arguments is not an object', () => {
        const request = createRequest({ ...attributes })
        const queryParametersType = QueryParametersType({ filter: [1, 2] })
        expect(() => {
          request.buildQuery(queryParametersType)
        }).toThrowError(new TypeError('query arguments are not of the correct type'))
      })

      it('when one of the arguments is undefined', () => {
        const request = createRequest({ ...attributes })
        const queryParametersType = QueryParametersType({ filter: { a: undefined } })
        expect(() => {
          request.buildQuery(queryParametersType)
        }).toThrowError(new TypeError('query arguments are not of the correct type'))
      })
    })
  })

  describe('api calls', () => {
    describe('get', () => {
      it('basic', async () => {
        fetch.mockReturnValue({ json: () => mockResponse })

        const createRequestFn = createRequest({ ...attributes })
        const response = await createRequestFn.get()

        expect(fetch).toBeCalledWith('http://traction/v1/requests', {
          method: 'GET',
          headers: { ...attributes.headers, ...defaultHeaders.jsonApi },
        })

        const jsonData = await response.json()
        expect(jsonData).toEqual(mockResponse)
      })

      it('with a query', async () => {
        const queryParametersType = QueryParametersType({
          filter: { a: '1', b: '2' },
          include: 'sample.tube',
          fields: { resource1: 'field1', resource2: 'field2' },
        })

        fetch.mockReturnValue({ json: () => mockResponse })

        const createRequestFn = createRequest({ ...attributes })
        const response = await createRequestFn.get(queryParametersType)

        expect(fetch).toBeCalledWith(
          'http://traction/v1/requests?filter[a]=1&filter[b]=2&include=sample.tube&fields[resource1]=field1&fields[resource2]=field2',
          {
            method: 'GET',
            headers: { ...attributes.headers, ...defaultHeaders.jsonApi },
          },
        )

        const jsonData = await response.json()
        expect(jsonData).toEqual(mockResponse)
      })
    })

    describe('create', () => {
      const data = { id: 1 }
      const mockCreate = { data: { status: 201 } }

      it('basic', async () => {
        fetch.mockReturnValue({ json: () => mockCreate })

        const request = createRequest({ ...attributes })
        const response = await request.create({ data })

        expect(fetch).toBeCalledWith('http://traction/v1/requests', {
          method: 'POST',
          headers: { ...attributes.headers, ...defaultHeaders.jsonApi },
          body: JSON.stringify(data),
        })

        const jsonData = await response.json()
        expect(jsonData).toEqual(mockCreate)
      })

      it('with include', async () => {
        fetch.mockReturnValue({ json: () => mockCreate })

        const request = createRequest({ ...attributes })
        const response = await request.create({ data, include: 'tube' })

        expect(fetch).toBeCalledWith('http://traction/v1/requests?include=tube', {
          method: 'POST',
          headers: { ...attributes.headers, ...defaultHeaders.jsonApi },
          body: JSON.stringify(data),
        })

        const jsonData = await response.json()
        expect(jsonData).toEqual(mockCreate)
      })
    })

    describe('find', () => {
      const data = { id: 1 }

      it('basic', async () => {
        fetch.mockReturnValue({ json: () => mockResponse })

        const request = createRequest({ ...attributes })
        const response = await request.find(data)

        expect(fetch).toBeCalledWith('http://traction/v1/requests/1', {
          method: 'GET',
          headers: { ...attributes.headers, ...defaultHeaders.jsonApi },
        })

        const jsonData = await response.json()
        expect(jsonData).toEqual(mockResponse)
      })

      it('with includes', async () => {
        fetch.mockReturnValue({ json: () => mockResponse })

        const request = createRequest({ ...attributes })
        const response = await request.find({ ...data, include: 'sample' })

        expect(fetch).toBeCalledWith('http://traction/v1/requests/1?include=sample', {
          method: 'GET',
          headers: { ...attributes.headers, ...defaultHeaders.jsonApi },
        })

        const jsonData = await response.json()
        expect(jsonData).toEqual(mockResponse)
      })
    })

    describe('update', () => {
      const payload = { data: { id: '1', attribute: 'boo' } }

      it('single', async () => {
        fetch.mockReturnValue({ json: () => mockResponse })

        const request = createRequest({ ...attributes })
        const response = await request.update(payload)

        expect(fetch).toBeCalledWith('http://traction/v1/requests/1', {
          method: 'PATCH',
          headers: { ...attributes.headers, ...defaultHeaders.jsonApi },
          body: JSON.stringify(payload),
        })

        const jsonData = await response.json()
        expect(jsonData).toEqual(mockResponse)
      })
    })

    describe('delete', () => {
      it('single', async () => {
        const ids = [1]

        fetch.mockReturnValue({ json: () => mockResponse })

        const request = createRequest({ ...attributes })
        const responses = await request.destroy(ids)

        expect(fetch).toBeCalledWith('http://traction/v1/requests/1', {
          method: 'DELETE',
          headers: { ...attributes.headers, ...defaultHeaders.jsonApi },
        })

        const jsonData = await responses[0].json()
        expect(jsonData).toEqual(mockResponse)
      })

      it('multiple', async () => {
        const ids = [1, 2, 3, 4, 5]

        fetch.mockReturnValue({ json: () => mockResponse })

        const request = createRequest({ ...attributes })
        const promises = request.destroy(ids).map((id) => {
          return fetch(`/requests/${id}`, { method: 'DELETE' })
        })

        for (const promise of promises) {
          const response = await promise
          expect(fetch).toBeCalled()
          expect(response.json()).toEqual(mockResponse)
        }
      })
    })
  })
  describe('QueryParametersType', () => {
    it('should return a valid object', () => {
      const queryParamsTypeObject = QueryParametersType({
        page: { page: 1, limit: 10 },
        filter: { name: 'test' },
        include: 'test',
        fields: { test: 'test' },
      })
      expect(queryParamsTypeObject).toEqual({
        page: { page: 1, limit: 10 },
        filter: { name: 'test' },
        include: 'test',
        fields: { test: 'test' },
      })
    })
    it('should return an empty object', () => {
      const queryParamsTypeObject = QueryParametersType()
      expect(queryParamsTypeObject).toEqual({ filter: {}, page: {}, include: '', fields: {} })
    })
  })

  describe('RequestType', () => {
    it('should return a valid object', () => {
      const parameters = {
        method: 'POST',
        url: 'test',
        api: { baseURL: 'test', headers: {} },
        data: { test: 'test' },
      }
      const requestTypeObject = RequestType(parameters)
      expect(requestTypeObject).toEqual({ ...parameters })
    })
    it('should return an object with default values', () => {
      const requestTypeObject = RequestType()
      expect(requestTypeObject).toEqual({
        method: 'GET',
        url: '',
        api: {},
        data: null,
      })
    })
  })
})

describe('createBasicRequest', () => {
  describe('basic attributes', () => {
    it('will have some headers', () => {
      const request = createBasicRequest({ ...attributes })
      expect(request.api.headers).toEqual({ ...defaultHeaders.json, ...attributes.headers })
    })

    it('will have some default headers if none were passed', () => {
      // eslint-disable-next-line no-unused-vars
      const { headers, ...rest } = attributes
      const request = createBasicRequest({ ...rest })
      expect(request.api.headers).toEqual(defaultHeaders.json)
    })

    it('will have a base url', () => {
      const request = createBasicRequest({ ...attributes })
      expect(request.baseURL).toEqual('http://traction')
    })

    it('will have an api', () => {
      const request = createBasicRequest({ ...attributes })
      expect(request.api).toBeDefined()
      const api = request.api
      expect(api.baseURL).toEqual(request.baseURL)
      const headerKeys = Object.keys(api.headers)
      expect(headerKeys.includes('header1')).toBeTruthy()
      expect(headerKeys.includes('header2')).toBeTruthy()
    })

    it('will have a path', () => {
      const request = createBasicRequest({ ...attributes })
      expect(request.path).toEqual(attributes.path)
    })
  })

  describe('get', () => {
    it('basic', async () => {
      fetch.mockReturnValue({ json: () => mockResponse })

      const createRequestFn = createBasicRequest({ ...attributes })
      const response = await createRequestFn.get()

      expect(fetch).toBeCalledWith('http://traction/my/url', {
        method: 'GET',
        headers: { ...attributes.headers, ...defaultHeaders.json },
      })

      const jsonData = await response.json()
      expect(jsonData).toEqual(mockResponse)
    })
  })
})
