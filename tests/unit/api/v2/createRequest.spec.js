import { defaultHeaders, createRequest } from '@/api/v2/createRequest.js'

import { expect } from 'vitest'

global.fetch = vi.fn()

describe('createRequest', () => {
  const attributes = {
    rootURL: 'http://traction',
    apiNamespace: 'v1',
    resource: 'requests',
    headers: {
      header1: 'header1',
      header2: 'header2',
    },
  }

  const mockResponse = {
    status: 200,
    data: [{ id: 1 }],
  }

  afterEach(() => {
    vi.clearAllMocks()
  })

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
      expect(request.api.headers).toEqual({ ...defaultHeaders, ...attributes.headers })
    })

    it('will have some default headers if none were passed', () => {
      // eslint-disable-next-line no-unused-vars
      const { headers, ...rest } = attributes
      const request = createRequest({ ...rest })
      expect(request.api.headers).toEqual(defaultHeaders)
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
      const query = request.buildQuery()
      expect(query).toEqual('')
    })

    it('filter', () => {
      const request = createRequest({ ...attributes })
      const query = request.buildQuery({ filter: { a: '1', b: '2' } })
      expect(query).toEqual('?filter[a]=1&filter[b]=2')
    })

    it('include', () => {
      const request = createRequest({ ...attributes })
      const query = request.buildQuery({ include: 'sample.tube' })
      expect(query).toEqual('?include=sample.tube')
    })

    it('fields', () => {
      const request = createRequest({ ...attributes })
      const query = request.buildQuery({ fields: { resource1: 'field1', resource2: 'field2' } })
      expect(query).toEqual('?fields[resource1]=field1&fields[resource2]=field2')
    })

    it('filter, include and fields', () => {
      const request = createRequest({ ...attributes })
      const query = request.buildQuery({
        filter: { a: '1', b: '2' },
        include: 'sample.tube',
        fields: { resource1: 'field1', resource2: 'field2' },
      })
      expect(query).toEqual(
        '?filter[a]=1&filter[b]=2&include=sample.tube&fields[resource1]=field1&fields[resource2]=field2',
      )
    })

    describe('if any arguments are not a string or an object', () => {
      it('when one of the values is not a string', () => {
        const request = createRequest({ ...attributes })
        expect(() => {
          request.buildQuery({ filter: { a: 1, b: 2 } })
        }).toThrowError(new TypeError('query arguments are not of the correct type'))
      })

      it('when one of the arguments is not an object', () => {
        const request = createRequest({ ...attributes })
        expect(() => {
          request.buildQuery({ filter: [1, 2] })
        }).toThrowError(new TypeError('query arguments are not of the correct type'))
      })

      it('when one of the arguments is undefined', () => {
        const request = createRequest({ ...attributes })
        expect(() => {
          request.buildQuery({ filter: { a: undefined } })
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
          headers: attributes.headers,
        })

        const jsonData = await response.json()
        expect(jsonData).toEqual(mockResponse)
      })

      it('with a query', async () => {
        const query = {
          filter: { a: '1', b: '2' },
          include: 'sample.tube',
          fields: { resource1: 'field1', resource2: 'field2' },
        }

        fetch.mockReturnValue({ json: () => mockResponse })

        const createRequestFn = createRequest({ ...attributes })
        const response = await createRequestFn.get(query)

        expect(fetch).toBeCalledWith(
          'http://traction/v1/requests?filter[a]=1&filter[b]=2&include=sample.tube&fields[resource1]=field1&fields[resource2]=field2',
          {
            method: 'GET',
            headers: attributes.headers,
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
          headers: attributes.headers,
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
          headers: attributes.headers,
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
          headers: attributes.headers,
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
          headers: attributes.headers,
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
          headers: attributes.headers,
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
          headers: attributes.headers,
        })

        const jsonData = await responses[0].json()
        expect(jsonData).toEqual(mockResponse)
      })

      it('multiple', async () => {
        const ids = [1, 2, 3, 4, 5]

        fetch.mockReturnValue({ json: () => mockResponse })

        const request = createRequest({ ...attributes })
        const promises = await request.destroy(ids)

        for (const promise of promises) {
          const response = await promise
          expect(fetch).toBeCalled()
          expect(response.json()).toEqual(mockResponse)
        }
      })
    })
  })
})
