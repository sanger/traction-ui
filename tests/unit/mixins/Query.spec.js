import Vue from 'vue'
import { mount } from '../testHelper'
import flushPromises from 'flush-promises'
import Response from '@/api/Response'
import Query from '@/mixins/Query'

const cmp = Vue.extend({
  mixins: [Query],
  render () { return ''}
})

describe('Query', () => {

  let headers, props, wrapper, query

  beforeEach(() => {
    headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    props = {baseURL: 'http://sequencescape.com', apiNamespace: 'api/v2', headers: headers, resource: 'requests'}
    wrapper = mount(cmp, { propsData: props })
    query = wrapper.vm
  })

  it('will have a baseURL', () => {
    expect(query.baseURL).toEqual('http://sequencescape.com')
  })

  it('will have an apiNamespace', () => {
    expect(query.apiNamespace).toEqual('api/v2')
  })

  it('will have an resource', () => {
    expect(query.resource).toEqual('requests')
  })

  it('will have some headers', () => {
    expect(query.headers).toEqual(headers)
  })

  it('will have a rootUrl', () => {
    expect(query.rootURL).toEqual('http://sequencescape.com/api/v2')
  })

  it('will create an api instance', () => {
    expect(query.api.defaults.baseURL).toEqual(query.rootURL)
    expect(query.api.defaults.headers['Content-Type']).toEqual(headers['Content-Type'])
    expect(query.api.defaults.headers['Accept']).toEqual(headers['Accept'])
  })

  describe('execute', () => {

    let response, apiResponse

    describe('get', () => {

      beforeEach(() => {
        query.api.get = jest.fn()
      })

      it('returns some appropriate data if successful', async () => {
        response = {status: 200, data: { data: [{id: 1, attributes: {name: 'sample1', species: 'dog'}}]}}
        apiResponse = new Response(response)
        query.api.get.mockResolvedValue(response)
        query.execute('get')
        await flushPromises()
        expect(query.data).toEqual(apiResponse)
      })

      it('returns an appropriate response if there is an error', async () => {
        response = { response: {status: 422, data: { errors: { name: ['error message1'], species: ['error message2'] }} }}
        query.api.get.mockRejectedValue(response)
        query.execute('get')
        await flushPromises()
        expect(query.errors).toEqual({ message: 'name error message1, species error message2' })
      })

      it('does nothing if the query is already loading', async () => {
        query.loading = true
        query.execute('get')
        await flushPromises()
        expect(query.api.get).not.toBeCalled()
      })
    })

  })

})
