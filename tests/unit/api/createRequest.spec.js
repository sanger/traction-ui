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

const mockResponse = {
  status: 200,
  data: { data: [{ id: 1 }] },
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
      expect(query).toEqual('')
    })

    it('filters no includes', () => {
      const request = createRequest({ ...attributes })
      const query = request.buildQuery({ filters: { a: '1', b: '2' } })
      expect(query).toEqual('/?filter[a]=1&filter[b]=2')
    })

    it('includes no filters', () => {
      const request = createRequest({ ...attributes })
      const query = request.buildQuery({ include: 'sample.tube' })
      expect(query).toEqual('/?include=sample.tube')
    })

    it('filters and includes', () => {
      const request = createRequest({ ...attributes })
      const query = request.buildQuery({ filters: { a: '1', b: '2' }, include: 'sample.tube' })
      expect(query).toEqual('/?filter[a]=1&filter[b]=2&include=sample.tube')
    })
  })

  describe('api calls', () => {
    beforeEach(() => {
      axios.create = jest.fn(() => mockAxios)
    })

    describe('get', () => {
      it('basic', async () => {
        mockAxios.get.mockReturnValue(mockResponse)
        const request = createRequest({ ...attributes })
        const response = await request.get()
        expect(mockAxios.get).toBeCalledWith(request.resource)
        expect(response).toEqual(mockResponse)
      })

      it('with a query', async () => {
        const query = { filters: { a: '1', b: '2' }, include: 'sample.tube' }
        mockAxios.get.mockReturnValue(mockResponse)
        const request = createRequest({ ...attributes })
        const response = await request.get(query)
        expect(mockAxios.get).toBeCalledWith(`${request.resource}${request.buildQuery(query)}`)
        expect(response).toEqual(mockResponse)
      })
    })

    it('create', async () => {
      const data = { id: 1 }
      const mockCreate = { data: { status: 201 } }
      mockAxios.post.mockReturnValue(mockCreate)
      const request = createRequest({ ...attributes })
      const response = await request.create({ data })
      expect(mockAxios.post).toBeCalledWith(request.resource, data)
      expect(response).toEqual(mockCreate)
    })

    describe('find', () => {
      it('basic', async () => {
        mockAxios.get.mockReturnValue(mockResponse)
        const request = createRequest({ ...attributes })
        const response = await request.find({ id: 1 })
        expect(mockAxios.get).toBeCalledWith(`${request.resource}/1`)
        expect(response).toEqual(mockResponse)
      })

      it('with includes', async () => {
        mockAxios.get.mockReturnValue(mockResponse)
        const request = createRequest({ ...attributes })
        const response = await request.find({ id: 1, include: 'sample' })
        expect(mockAxios.get).toBeCalledWith(
          `${request.resource}/1${request.buildQuery({ include: 'sample' })}`,
        )
        expect(response).toEqual(mockResponse)
      })
    })

    describe('update', () => {
      const data = { id: '1', attribute: 'boo' }

      it('single', async () => {
        mockAxios.patch.mockReturnValue(mockResponse)
        const request = createRequest({ ...attributes })
        const response = await request.update(data)
        expect(mockAxios.patch).toBeCalled()
        expect(response).toEqual(mockResponse)
      })

      it('multiple', async () => {
        mockAxios.patch.mockReturnValue(mockResponse)
        const request = createRequest({ ...attributes })
        const promises = await request.update([data, data, data])
        for (const promise of promises) {
          const response = await promise
          expect(mockAxios.patch).toBeCalled()
          expect(response).toEqual(mockResponse)
        }
      })
    })

    describe('delete', () => {
      it('single', async () => {
        mockAxios.delete.mockReturnValue(mockResponse)
        const request = createRequest({ ...attributes })
        const response = await request.destroy(1)
        expect(mockAxios.delete).toBeCalled()
        expect(response).toEqual(mockResponse)
      })

      it('multiple', async () => {
        mockAxios.delete.mockReturnValue(mockResponse)
        const request = createRequest({ ...attributes })
        const promises = await request.destroy(1, 2, 3, 4, 5)
        for (const promise of promises) {
          const response = await promise
          expect(mockAxios.delete).toBeCalled()
          expect(response).toEqual(mockResponse)
        }
      })
    })
  })
})

// describe('update', () => {
//   beforeEach(() => {
//     data = [
//       { data: { type: 'requests', id: 1, attributes: { state: 'started' } } },
//       { data: { type: 'requests', id: 2, attributes: { state: 'started' } } },
//       { data: { type: 'requests', id: 3, attributes: { state: 'started' } } },
//       { data: { type: 'requests', id: 4, attributes: { state: 'started' } } },
//       { data: { type: 'requests', id: 5, attributes: { state: 'started' } } },
//     ]
//     request.api.patch = jest.fn()
//   })

//   it('single', () => {
//     let promise = new Promise(() => {})
//     request.api.patch.mockReturnValue(promise)

//     let promises = request.update(data[0])

//     expect(request.api.patch).toBeCalledWith(`${request.resource}/1`, data[0])
//     expect(promises).toEqual([promise])
//   })

//   it('multiple', () => {
//     let promise = new Promise(() => {})
//     request.api.patch.mockReturnValue(promise)

//     let promises = request.update(data)

//     expect(request.api.patch).toBeCalledTimes(data.length)
//     expect(promises).toEqual([promise, promise, promise, promise, promise])
//   })
// })
