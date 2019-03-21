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

        it('resolves promise to an appropriate response if successful', async () => {
          mockResponse = {status: 200, data: { data: [{id: 1, attributes: {name: 'sample1', species: 'dog'}}]}}
          request.api.get.mockResolvedValue(mockResponse)

          let promise = request.execute('get')
          await expect(promise).resolves.toEqual(mockResponse);
        })

        it('rejects promise to an appropriate response if there is an error', async () => {
          mockResponse = { status: 422, data: { errors: { name: ['error message1'], species: ['error message2'] }} }
          request.api.get.mockRejectedValue(mockResponse)

          let promise = request.execute('get')
          await expect(promise).rejects.toEqual(mockResponse);
        })

        it('returns a promise', () => {
          let promise = request.execute('get')
          expect(promise).toBeInstanceOf(Promise)
        })
      })

    })

    describe('api calls', () => {

      let data

      beforeEach(() => {

      })

      it('get', () => {
        request.api.get = jest.fn()
        mockResponse = {status: 200, data: { data: [{id: 1, attributes: {name: 'sample1', species: 'dog'}}]}}
        request.api.get.mockResolvedValue(mockResponse)

        let promise = request.get()
        expect(request.api.get).toBeCalled
        expect(promise).resolves.toEqual(mockResponse);
      })

      it('find', () => {
        request.api.get = jest.fn()
        mockResponse = {status: 200, data: { data: {id: 1, attributes: {name: 'sample1', species: 'dog'}}}}
        request.api.get.mockResolvedValue(mockResponse)
        let id = 1

        let promise = request.find(id)
        expect(request.api.get).toBeCalled
        expect(promise).resolves.toEqual(mockResponse);
      })

      it('create', () => {
        request.api.post = jest.fn()
        data = { data: { attributes: { samples: [{name: 'sample1', species: 'dog'}, {name: 'sample2', species: 'cat'}] }}}
        mockResponse = {data: {status: 201}}
        request.api.post.mockReturnValue(mockResponse)

        let promise = request.create(data)
        expect(request.api.post).toBeCalled
        expect(promise).resolves.toEqual(mockResponse);
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
        })

        it('single', () => {
          let promise = new Promise((resolve, reject) => {})
          request.api.patch.mockReturnValue(promise)

          let promises = request.update(data[0])

          expect(request.api.patch).toBeCalledWith(`${request.resource}/1`, data[0])
          expect(promises).toEqual([promise]);
        })

        it('multiple', () => {
          let promise = new Promise((resolve, reject) => {})
          request.api.patch.mockReturnValue(promise)

          let promises = request.update(data)

          expect(request.api.patch).toBeCalledTimes(data.length)
          expect(promises).toEqual([promise, promise, promise, promise, promise]);
        })

      })

      describe('destroy', () => {
        beforeEach(() => {
          request.api.delete = jest.fn()
        })

        it('single', () => {
          let promise = new Promise((resolve, reject) => {})
          request.api.delete.mockReturnValue(promise)

          let promises = request.destroy(1)

          expect(request.api.delete).toBeCalledWith(`${request.resource}/1`)
          expect(promises).toEqual([promise])
        })

        it('multiple', () => {
          let promise = new Promise((resolve, reject) => {})
          request.api.delete.mockReturnValue(promise)

          let promises = request.destroy([1,2,3,4,5])

          expect(request.api.delete).toBeCalledTimes(data.length)
          expect(promises).toEqual([promise, promise, promise, promise, promise]);
        })

      })

    })
  })

  describe('build query', () => {

    beforeEach(() => {
      headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      props = { baseURL: 'http://sequencescape.com',
                apiNamespace: 'api/v2',
                headers: headers,
                resource: 'requests'
              }
    })

    it('without any query parameters', () => {
      wrapper = mount(cmp, { propsData: props })
      request = wrapper.vm
      expect(request.buildQuery()).toEqual('')
    })

    it('with filter only', () => {
      Object.assign(props, {filter: {type: 'long_read', state: 'pending'}})
      wrapper = mount(cmp, { propsData: props })
      request = wrapper.vm
      expect(request.buildQuery({filter: undefined})).toEqual('?filter[type]=long_read&filter[state]=pending')
    })

    it('with include only', () => {
      Object.assign(props, {include: 'samples.sample_metadata'})
      wrapper = mount(cmp, { propsData: props })
      request = wrapper.vm
      expect(request.buildQuery({include: undefined})).toEqual('?include=samples.sample_metadata')
    })

    it('with filter and includes', () => {
      Object.assign(props, {filter: {type: 'long_read', state: 'pending'}, include: 'samples.sample_metadata'})
      wrapper = mount(cmp, { propsData: props })
      request = wrapper.vm
      expect(request.buildQuery({filter: undefined, include: undefined})).toEqual('?filter[type]=long_read&filter[state]=pending&include=samples.sample_metadata')
    })

    it('with dynamic filter', () => {
      Object.assign(props, {filter: {type: 'long_read', state: 'pending'}})
      wrapper = mount(cmp, { propsData: props })
      request = wrapper.vm
      expect(request.buildQuery({filter: {see: 'you_there', from: 'here'}})).toEqual('?filter[see]=you_there&filter[from]=here')
    })

    it('with dynamic include', () => {
      Object.assign(props, {include: 'samples.sample_metadata'})
      'samples.sample_metadata'
      wrapper = mount(cmp, { propsData: props })
      request = wrapper.vm
      expect(request.buildQuery({include: 'snap.crackle.pop'})).toEqual('?include=snap.crackle.pop')
    })

    it('with dynamic filter and includes', () => {
      Object.assign(props, {filter: {type: 'long_read', state: 'pending'}, include: 'samples.sample_metadata'})
      wrapper = mount(cmp, { propsData: props })
      request = wrapper.vm
      expect(request.buildQuery({filter: {see: 'you_there', from: 'here'}, include: 'snap.crackle.pop'})).toEqual('?filter[see]=you_there&filter[from]=here&include=snap.crackle.pop')
    })

    it('with a get', () => {
      Object.assign(props, {filter: {type: 'long_read', state: 'pending'}})
      wrapper = mount(cmp, { propsData: props })
      request = wrapper.vm
      request.api.get = jest.fn()
      request.get({include: 'snap.crackle.pop'})
      expect(request.api.get).toBeCalledWith(`${request.resource}${request.buildQuery({filter: {type: 'long_read', state: 'pending'}, include: 'snap.crackle.pop'})}`)
    })

    describe('with a find', () => {
      it('no include', () => {
        wrapper = mount(cmp, { propsData: props })
        request = wrapper.vm
        request.api.get = jest.fn()
        request.find(1)
        expect(request.api.get).toBeCalledWith(`${request.resource}/1`)
      })

      it('include in props', () => {
        Object.assign(props, {include: 'snap.crackle.pop'})
        wrapper = mount(cmp, { propsData: props })
        request = wrapper.vm
        request.api.get = jest.fn()
        request.find(1)
        expect(request.api.get).toBeCalledWith(`${request.resource}/1${request.buildQuery({include: 'snap.crackle.pop'})}`)
      })

      it('dynamic include', () => {
        Object.assign(props, {include: 'snap.crackle.pop'})
        wrapper = mount(cmp, { propsData: props })
        request = wrapper.vm
        request.api.get = jest.fn()
        request.find(1, {include: 'the.real.thing'})
        expect(request.api.get).toBeCalledWith(`${request.resource}/1${request.buildQuery({include: 'the.real.thing'})}`)
      })
    })

  })

})
