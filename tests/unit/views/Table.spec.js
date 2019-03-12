import { mount, localVue } from '../testHelper'
import Table from '@/views/Table'

describe('Table.vue', () => {

  let wrapper, table

  beforeEach(() => {
    wrapper = mount(Table, {
      localVue,
      propsData: {
        items: [{id: 1, barcode: 123, material: {id: 345, attr1: 'test', type: 'samples'}}]
      },
    })

    table = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Table')
  })

  it.skip('has a items property', () => {
    expect(table.items).toEqual([{id: 1, barcode: 123, type: 'samples', material: {id: 345, attr1: 'test'}}])
  })

  it('btable contains the correct data', () => {
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(table.items.length)
  })

  describe('#getItems', () => {
    it('returns the items props', () => {
      expect(table.getItems).toEqual([ { id: 345, attr1: 'test', barcode: 123, type: 'samples' } ])
    })
  })

  describe('#setType', () => {
    it('returns the items props', () => {
      table.setType()
      expect(table.dataType).toEqual('samples')
    })
  })
})
