import Libraries from '@/views/Libraries'
import Alert from '@/components/Alert'
import { mount, localVue } from '../testHelper'
import DataList from '@/api/DataList'

describe('Libraries.vue', () => {

  let wrapper, data

  beforeEach(() => {
    data = { body: [
      { "id": 1, "attributes": { "barcode": "TRAC-11111", "state": "pending" }},
      { "id": 2, "attributes": { "barcode": "TRAC-11112", "state": "pending" }},
      { "id": 3, "attributes": { "barcode": "TRAC-11113", "state": "pending" }},
      { "id": 4, "attributes": { "barcode": "TRAC-11114", "state": "pending" }},
      { "id": 5, "attributes": { "barcode": "TRAC-11115", "state": "pending" }}
    ]}
    wrapper = mount(Libraries, { localVue })
    wrapper.find(DataList).vm.data = data
  })

  it('has a data list', () => {
    expect(wrapper.contains(DataList)).toBe(true)
  })

  it('has a alert', () => {
    expect(wrapper.contains(Alert)).toBe(true)
  })

  it('contains a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  it('contains the correct data', () => {
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(data.body.length)
  })

})
