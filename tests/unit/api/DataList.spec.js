import { mount, localVue } from '../testHelper'
import flushPromises from 'flush-promises'
import DataList from '@/components/api/DataList'

describe('DataList', () => {

  describe('filters', () => {

    let wrapper, dataList, props, filters

    beforeEach(() => {
      props = {resource: 'requests'}
      filters = {type: 'long_read', state: 'pending'}
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

})