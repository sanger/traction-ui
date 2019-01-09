import Vue from 'vue'
import { mount, localVue } from '../testHelper'
import flushPromises from 'flush-promises'
import DataList from '@/api/DataList'
import Response from '@/api/Response'

const listCmp = Vue.extend({
  name: 'listCmp',
  template: `
            <data-list ref="requests" baseURL="http://examplehost:1234" apiNamespace="abc/v1" resource="requests">
                <div slot-scope="{ data: requests, errors, loading }">
                  <span class="loading" v-if="loading">Loading...</span>
                  <span class="errors" v-else-if="errors">{{ errors }}</span>
                  <ul v-else>
                    <li v-for="request in requests" :key="request.id">
                      <h3>{{ request.id }}</h3>
                      <h3>{{ request.attributes.name }}</h3>
                    </li>
                  </ul>
                </div>
              </data-list>`,
  components: {
    DataList
  }
})

describe('DataList', () => {

  let props, filters

  beforeEach(() => {
    props = {resource: 'requests', baseURL: 'http://examplehost:1234', apiNamespace: "abc/v1"}
    filters = {type: 'long_read', state: 'pending'}
  })

  describe('filters', () => {

    let wrapper, dataList

    beforeEach(() => {
      wrapper = mount(DataList, { mocks: localVue, propsData: Object.assign(props, { filters: filters }) })
      dataList = wrapper.vm
    })

    it('creates a suitable prop', () => {
      expect(dataList.filters).toEqual(filters)
    })

    it('creates a suitable endpoint', () => {
      expect(dataList.endpoint).toEqual('requests?filter[type]=long_read&filter[state]=pending')
    })

  })

  describe('#load', () => {

    let wrapper, dataList

    beforeEach(() => {
      wrapper = mount(DataList, { mocks: localVue, propsData: Object.assign(props, { filters: filters }) })
      dataList = wrapper.vm
      dataList.api.get = jest.fn()
    })

    it('has data on execute', async () => {
      let data = { data: [{id: 1, attributes: {name: 'sample1', species: 'dog'}}]}
      let response = {status: 200, data: data }
      let apiResponse = new Response(response)
      dataList.api.get.mockResolvedValue(response)
      dataList.load()
      await flushPromises()
      expect(dataList.data).toEqual(apiResponse)
    })

  })

  describe('scoped slots', () => {

    let wrapper, data

    beforeEach(() => {
      data = { body: [{id: 1, attributes: {name: 'sample1', species: 'dog'}}, {id: 2, attributes: {name: 'sample2', species: 'cat'}}]}
      wrapper = mount(listCmp)
    })

    it('will render the sample data if they exist', () => {
      wrapper.find(DataList).vm.data = data
      let list = wrapper.find('ul').findAll('li')
      expect(list.length).toEqual(2)
      let sampleRow = list.at(0).findAll('h3')
      expect(sampleRow.at(0).text()).toEqual('1')
      expect(sampleRow.at(1).text()).toEqual('sample1')
    })

    it('will render an error if something goes wrong', () => {
      wrapper.find(DataList).vm.errors = 'Something went wrong'
      let errors = wrapper.find('.errors')
      expect(errors.text()).toEqual('Something went wrong')
    })

    it('will provide a message if the data is being loaded', () => {
       wrapper.find(DataList).vm.loading = true
      let loading = wrapper.find('.loading')
      expect(loading.text()).toEqual('Loading...')
    })

  })

})
