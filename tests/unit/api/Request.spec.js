import Vue from 'vue'
import { mount } from '../testHelper'
import Request from '@/api/Request'

const cmp = Vue.extend({
  mixins: [Request],
  render () { return ''}
})

describe('Request', () => {

  let headers, props, wrapper, request, response, mockResponse

  describe('Request', () => {
    beforeEach(() => {
      headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      props = { baseURL: 'http://sequencescape.com',
                apiNamespace: 'api/v2',
                headers: headers,
                resource: 'requests',
                filter: {type: 'long_read', state: 'pending'},
                include: 'samples.sample_metadata'
              }
      wrapper = mount(cmp, { propsData: props })
      request = wrapper.vm
    })

    it('will have a baseURL', () => {
      expect(request.baseURL).toEqual('http://sequencescape.com')
    })

    it('will have an apiNamespace', () => {
      expect(request.apiNamespace).toEqual('api/v2')
    })

    it('will have an resource', () => {
      expect(request.resource).toEqual('requests')
    })

    it('will have some headers', () => {
      expect(request.headers).toEqual(headers)
    })

    it('will have a rootUrl', () => {
      expect(request.rootURL).toEqual('http://sequencescape.com/api/v2')
    })

    it('will create an api instance', () => {
      expect(request.api.defaults.baseURL).toEqual(request.rootURL)
      expect(request.api.defaults.headers['Content-Type']).toEqual(headers['Content-Type'])
      expect(request.api.defaults.headers['Accept']).toEqual(headers['Accept'])
    })

    it('can have some filters', () => {
      expect(request.filter).toEqual(props.filter)
    })

    it('can have an include', () => {
      expect(request.include).toEqual(props.include)
    })

    describe('execute', () => {

      describe('get', () => {

        beforeEach(() => {
          request.api.get = jest.fn()
        })

        it('returns some appropriate data if successful', async () => {
          mockResponse = {status: 200, data: { data: [{id: 1, attributes: {name: 'sample1', species: 'dog'}}]}}
          request.api.get.mockResolvedValue(mockResponse)
          response = await request.execute('get')
          expect(response.data).toEqual(mockResponse.data)
        })

        it('returns an appropriate response if there is an error', async () => {
          mockResponse = { status: 422, data: { errors: { name: ['error message1'], species: ['error message2'] }} }
          request.api.get.mockRejectedValue(mockResponse)
          response = await request.execute('get')
          expect(response.data.errors).toEqual(mockResponse.data.errors)
        })

        it('does nothing if the request is already loading', async () => {
          request.loading = true
          await request.execute('get')
          expect(request.api.get).not.toBeCalled()
        })
      })

    })

    describe('api calls', () => {

      let data

      beforeEach(() => {

      })

      it('get', async () => {
        request.api.get = jest.fn()
        mockResponse = {status: 200, data: { data: [{id: 1, attributes: {name: 'sample1', species: 'dog'}}]}}
        request.api.get.mockResolvedValue(mockResponse)
        response = await request.get()
        expect(request.api.get).toBeCalledWith(`${request.resource}${request.query}`)
        expect(response.data).toEqual(mockResponse.data)
      })

      it('find', async () => {
        request.api.get = jest.fn()
        mockResponse = {status: 200, data: { data: {id: 1, attributes: {name: 'sample1', species: 'dog'}}}}
        request.api.get.mockResolvedValue(mockResponse)
        let id = 1
        response = await request.find(id)
        expect(request.api.get).toBeCalledWith(`${request.resource}/1${request.query}`)
        expect(response.data).toEqual(mockResponse.data)
      })

      it('create', async () => {
        request.api.post = jest.fn()
        data = { data: { attributes: { samples: [{name: 'sample1', species: 'dog'}, {name: 'sample2', species: 'cat'}] }}}
        mockResponse = {data: {status: 201}}
        request.api.post.mockReturnValue(mockResponse)
        response = await request.create(data)
        expect(request.api.post).toBeCalledWith(request.resource, data)
        expect(response.data).toEqual(mockResponse.data)
      })

      describe('update', () => {

        beforeEach(() => {
          data = [
            { data: { type: 'requests', id: 1, attributes: { state: 'started' }}},
            { data: { type: 'requests', id: 2, attributes: { state: 'started' }}},
            { data: { type: 'requests', id: 3, attributes: { state: 'started' }}},
            { data: { type: 'requests', id: 4, attributes: { state: 'started' }}},
            { data: { type: 'requests', id: 5, attributes: { state: 'started' }}}
          ]
          request.api.patch = jest.fn()
          mockResponse = {data: { status: 200}}
          request.api.patch.mockReturnValue(mockResponse)
        })

        it('single', async () => {
          response = await request.update(data[0])
          expect(request.api.patch).toBeCalledWith(`${request.resource}/1`, data[0])
          expect(response[0].data).toEqual(mockResponse.data)
        })

        it('multiple', async () => {
          response = await request.update(data)
          expect(request.api.patch).toBeCalledTimes(data.length)
          expect(response.length).toEqual(data.length)
        })

      })

      describe('destroy', () => {
        beforeEach(() => {
          request.api.delete = jest.fn()
          mockResponse = {data: { status: 200}}
          request.api.delete.mockReturnValue(mockResponse)
        })

        it('single', async () => {
          response = await request.destroy(1)
          expect(request.api.delete).toBeCalledWith(`${request.resource}/1`)
          expect(response[0].data).toEqual(mockResponse.data)
        })

        it('multiple', async () => {
          response = await request.destroy([1,2,3,4,5])
          expect(request.api.delete).toBeCalledTimes(data.length)
          expect(response.length).toEqual(data.length)
        })

      })

    })
  })

  describe('#query', () => {

    beforeEach(() => {
      headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      props = { baseURL: 'http://sequencescape.com',
                apiNamespace: 'api/v2',
                headers: headers,
                resource: 'requests'
              }
    })

    it('creates a suitable query string with no filter or includes', () => {
      wrapper = mount(cmp, { propsData: props })
      request = wrapper.vm

      expect(request.query).toEqual('')
    })

    it('creates a suitable query string', () => {
      Object.assign(props, {filter: {type: 'long_read', state: 'pending'}, include: 'samples.sample_metadata'})
      wrapper = mount(cmp, { propsData: props })
      request = wrapper.vm

      expect(request.query).toEqual('?filter[type]=long_read&filter[state]=pending&include=samples.sample_metadata')
    })

    it('creates a suitable query string with filter, no includes', () => {
      Object.assign(props, {filter: {type: 'long_read', state: 'pending'}})
      wrapper = mount(cmp, { propsData: props })
      request = wrapper.vm

      expect(request.query).toEqual('?filter[type]=long_read&filter[state]=pending')

    })

    it('creates a suitable query string with includes, no filter', () => {
      Object.assign(props, {include: 'samples.sample_metadata'})
      wrapper = mount(cmp, { propsData: props })
      request = wrapper.vm

      expect(request.query).toEqual('?include=samples.sample_metadata')
    })

    describe('build query', () => {

      it('without any query parameters', () => {
        wrapper = mount(cmp, { propsData: props })
        request = wrapper.vm
        expect(request.buildQuery()).toEqual('')
      })

      it('with filter only', () => {
        Object.assign(props, {filter: {type: 'long_read', state: 'pending'}})
        wrapper = mount(cmp, { propsData: props })
        request = wrapper.vm
        expect(request.buildQuery(['filter'])).toEqual('?filter[type]=long_read&filter[state]=pending')
      })

      it('with include only', () => {
        Object.assign(props, {include: 'samples.sample_metadata'})
        wrapper = mount(cmp, { propsData: props })
        request = wrapper.vm
        expect(request.buildQuery(['include'])).toEqual('?include=samples.sample_metadata')
      })

      it('with filter and includes', () => {
        Object.assign(props, {filter: {type: 'long_read', state: 'pending'}, include: 'samples.sample_metadata'})
        wrapper = mount(cmp, { propsData: props })
        request = wrapper.vm
        expect(request.buildQuery(['filter', 'include'])).toEqual('?filter[type]=long_read&filter[state]=pending&include=samples.sample_metadata')
      })

      it('with dynamic filter', () => {
        Object.assign(props, {filter: {type: 'long_read', state: 'pending'}})
        wrapper = mount(cmp, { propsData: props })
        request = wrapper.vm
        expect(request.buildQuery(['filter', 'include'], {filter: {see: 'you_there', from: 'here'}})).toEqual('?filter[see]=you_there&filter[from]=here')
      })

      it('with dynamic include', () => {
        Object.assign(props, {include: 'samples.sample_metadata'})
        include: 'samples.sample_metadata'
        wrapper = mount(cmp, { propsData: props })
        request = wrapper.vm
        expect(request.buildQuery(['filter', 'include'], {include: 'snap.crackle.pop'})).toEqual('?include=snap.crackle.pop')
      })

      it('with dynamic filter and includes', () => {
        Object.assign(props, {filter: {type: 'long_read', state: 'pending'}, include: 'samples.sample_metadata'})
        wrapper = mount(cmp, { propsData: props })
        request = wrapper.vm
        expect(request.buildQuery(['filter', 'include'], {filter: {see: 'you_there', from: 'here'}, include: 'snap.crackle.pop'})).toEqual('?filter[see]=you_there&filter[from]=here&include=snap.crackle.pop')
      })
    })

  })

})
