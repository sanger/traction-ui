import Samples from '@/views/Samples'
import { mount, localVue } from './testHelper'
import DataList from '@/api/DataList'

describe('Samples.vue', () => {

  let wrapper, samples, data

  beforeEach(() => {
    data = { body: [
      { "id": 1, "attributes": { "name": "DN11111", "species": "cat", "state": "pending" }},
      { "id": 2, "attributes": { "name": "DN11112", "species": "cat", "state": "pending" }},
      { "id": 3, "attributes": { "name": "DN11113", "species": "dog", "state": "pending" }},
      { "id": 4, "attributes": { "name": "DN11114", "species": "dog", "state": "pending" }},
      { "id": 5, "attributes": { "name": "DN11115", "species": "cat", "state": "pending" }}
    ]}
    wrapper = mount(Samples, { localVue })
    wrapper.find(DataList).vm.data = data
    samples = wrapper.vm
  })

  it('has a data list', () => {
    expect(wrapper.contains(DataList)).toBe(true)
  })

  it('contains a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  it('contains the correct data', () => {
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(data.body.length)
  })
})
