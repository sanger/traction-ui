import { defaultHeaders, createRequest } from '@/api/v1/createRequest'
import axios from 'axios'

// vi.mock('axios')

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
    data: { data: [{ id: 1 }] },
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
      expect(request.headers).toEqual({ ...defaultHeaders, ...attributes.headers })
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
    beforeEach(() => {
      vi.spyOn(axios, 'get')
      vi.spyOn(axios, 'delete')
      vi.spyOn(axios, 'patch')
      vi.spyOn(axios, 'post')
    })
    describe('get', () => {
      it('basic', async () => {
        axios.get.mockReturnValue(mockResponse)
        const request = createRequest({ ...attributes })
        const response = await request.get()
        expect(axios.get).toBeCalledWith(request.resource)
        expect(response).toEqual(mockResponse)
      })

      it('with a query', async () => {
        const query = {
          filter: { a: '1', b: '2' },
          include: 'sample.tube',
          fields: { resource1: 'field1', resource2: 'field2' },
        }
        const request = createRequest({ ...attributes })
        const response = await request.get(query)
        expect(axios.get).toBeCalledWith(
          'requests?filter[a]=1&filter[b]=2&include=sample.tube&fields[resource1]=field1&fields[resource2]=field2',
        )
        expect(response).toEqual(mockResponse)
      })
    })

    describe('create', () => {
      const data = { id: 1 }
      const mockCreate = { data: { status: 201 } }

      it('basic', async () => {
        const request = createRequest({ ...attributes })
        const response = await request.create({ data })
        expect(axios.post).toBeCalledWith('requests', data)
        expect(response).toEqual(mockCreate)
      })

      it('with include', async () => {
        axios.post.mockReturnValue(mockCreate)
        const request = createRequest({ ...attributes })
        const response = await request.create({ data, include: 'tube' })
        expect(axios.post).toBeCalledWith('requests?include=tube', data)
        expect(response).toEqual(mockCreate)
      })
    })

    describe('find', () => {
      it('basic', async () => {
        const request = createRequest({ ...attributes })
        const response = await request.find({ id: 1 })
        expect(axios.get).toBeCalledWith('requests/1')
        expect(response).toEqual(mockResponse)
      })

      it('with includes', async () => {
        const request = createRequest({ ...attributes })
        const response = await request.find({ id: 1, include: 'sample' })
        expect(axios.get).toBeCalledWith('requests/1?include=sample')
        expect(response).toEqual(mockResponse)
      })
    })

    describe('update', () => {
      const payload = { data: { id: '1', attribute: 'boo' } }

      it('single', async () => {
        const request = createRequest({ ...attributes })
        const response = await request.update(payload)
        expect(axios.patch).toBeCalled()
        expect(response).toEqual(mockResponse)
      })
    })

    describe('delete', () => {
      it('single', async () => {
        const request = createRequest({ ...attributes })
        const response = await request.destroy(['1'])
        expect(axios.delete).toBeCalled()
        expect(response).toEqual([mockResponse])
      })

      it('multiple', async () => {
        const request = createRequest({ ...attributes })
        const promises = await request.destroy(['1', '2', '3', '4', '5'])
        for (const promise of promises) {
          const response = await promise
          expect(axios.delete).toBeCalled()
          expect(response).toEqual(mockResponse)
        }
      })
    })
  })
})
