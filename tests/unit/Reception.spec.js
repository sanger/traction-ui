import Reception from '@/views/Reception'
import Alert from '@/components/Alert'
import { mount, localVue } from './testHelper'
import DataList from '@/api/DataList'

describe('Reception.vue', () => {

  let wrapper, reception, data

  beforeEach(() => {
    data = [
      { "id": 1, "name": "DN11111", "species": "cat" },
      { "id": 2, "name": "DN11112", "species": "cat" },
      { "id": 3, "name": "DN11113", "species": "dog" },
      { "id": 4, "name": "DN11114", "species": "dog" },
      { "id": 5, "name": "DN11115", "species": "cat" }
    ]
    wrapper = mount(Reception, { localVue })
    wrapper.find(DataList).vm.data = data
    reception = wrapper.vm
  })

  it('has a data list', () => {
    expect(wrapper.contains(DataList)).toBe(true)
  })

  it('contains a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  it('contains the correct data', () => {
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(data.length)
  })

  describe('selected', () => {

    let checkboxes

    beforeEach(() => {
      let checkboxes = wrapper.findAll(".selected")
      checkboxes.at(0).trigger('click')
      checkboxes.at(1).trigger('click')
      checkboxes.at(2).trigger('click')
    })

    it('will find the requests which have been selected', () => {
      expect(reception.selected.length).toEqual(3)
    })

    xit('will allow for the import of selected requests into the service', () => {

    })
  })

})
