import { mount, localVue } from '../testHelper'
import Table from '@/views/Table'
import Samples from '@/views/Samples'
import Libraries from '@/views/Libraries'
import Alert from '@/components/Alert'

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

  describe('dataTable', () => {
    describe('when dataType is samples', () => {
      it('has a sample table if requested', () => {
        expect(wrapper.contains(Samples)).toBe(true)
      })

      it('renders the sample table', () => {
        let typeIDHeader = wrapper.find('thead').find('tr').findAll('th').at(1).html()
        expect(typeIDHeader).toMatch('Sample ID')
      })
    })

    describe('when dataType is libraries', () => {
      let libraryWrapper
      beforeEach(() => {
        libraryWrapper = mount(Table, {
          localVue,
          propsData: {
            items: [{id: 1, barcode: 123, material: {id: 345, attr1: 'test', type: 'libraries'}}]
          },
        })
      })

      it('has a libraries table if requested', () => {
        expect(libraryWrapper.contains(Libraries)).toBe(true)
      })

      it('renders the library table', () => {
        let typeIDHeader = libraryWrapper.find('thead').find('tr').findAll('th').at(1).html()
        expect(typeIDHeader).toMatch('Library ID')
      })
    })
  })

  describe('alert', () => {
    it('has a alert', () => {
      expect(wrapper.contains(Alert)).toBe(true)
    })
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

  describe('#showAlert', () => {
    it('passes the message to function on emit event', () => {
      let samples = wrapper.find(Samples)
      samples.vm.$emit('alert', 'a message')
      expect(table.message).toEqual('a message')
    })
  })
})
