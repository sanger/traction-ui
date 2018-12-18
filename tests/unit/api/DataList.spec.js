import Vue from 'vue'
import { mount, localVue } from '../testHelper'
import flushPromises from 'flush-promises'
import DataList from '@/api/DataList'

const listCmp = Vue.extend({
  name: 'listCmp',
  template: `
              <data-list resource="requests">
                <div slot-scope="{ data: requests }">
                  <ul>
                    <li v-for="request in requests" :key="request.id">
                      <h3>{{ request.id }}</h3>
                      <h3>{{ request.attributes.name }}</h3>
                    </li>
                  </ul>
                </div>
              </data-list>`,
  components: {
    DataList
  },
  data () {
    return {
      requests: []
    }
  }
})

describe('DataList', () => {

  let props, filters

  beforeEach(() => {
    props = {resource: 'requests'}
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
      dataList.api.get.mockResolvedValue(response)
      dataList.load()
      await flushPromises()
      expect(dataList.data).toEqual(data)
    })

  })

  describe('scoped slots', () => {

    let wrapper, dataList, data

    beforeEach(() => {
      data = [{id: 1, attributes: {name: 'sample1', species: 'dog'}}, {id: 2, attributes: {name: 'sample2', species: 'cat'}}]
      wrapper = mount(listCmp)
      wrapper.setData({ requests: data })
      dataList = wrapper.vm
    })

    it('will have a two rows with sample data', () => {
      expect(dataList.requests).toBe(data)
      console.log(dataList.requests)
      // let row = wrapper.find('#listCmp')
      console.log(wrapper.html())
      // expect(row.at(1).text()).toEqual("")
      // expect(sampleRow.at(1).text()).toEqual("1")
      // expect(sampleRow.at(2).text()).toEqual("DN11111")
      // expect(sampleRow.at(3).text()).toEqual("cat")
    })

    xit('has two samples in the template', () => {
      expect(dataList.data).toEqual(data)
    })

    xit('has scoped slots', () => {
      console.log(dataList.$scopedSlots)
      expect(dataList.$scopedSlots).toEqual({})
    })

  })

})
