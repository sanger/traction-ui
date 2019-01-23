import LibraryItem from '@/components/LibraryItem'
import { mount } from '../testHelper'

describe('LibraryItem.vue', () => {

  let wrapper, library, libraryItem

  beforeEach(() => {
    library = { id: "1", sampleName: 'sam', barcode: 'TRAC-11111', state: 'pending' }
    wrapper = mount(LibraryItem, { propsData: library })
    libraryItem = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('LibraryItem')
  })

  it('will have an id', () => {
    expect(libraryItem.id).toEqual('1')
  })

  it('will have an sample name', () => {
    expect(libraryItem.sampleName).toEqual('sam')
  })

  it('will have a barcode', () => {
    expect(libraryItem.barcode).toEqual('TRAC-11111')
  })

  it('will have a state', () => {
    expect(libraryItem.state).toEqual('pending')
  })

  it('will produce some json', () => {
    expect(libraryItem.json).toEqual(library)
  })

  it('will have a row with sample data', () => {
    let row = wrapper.find('tr').findAll('td')
    expect(row.at(0).text()).toEqual("")
    expect(row.at(1).text()).toEqual("1")
    expect(row.at(2).text()).toEqual("sam")
    expect(row.at(3).text()).toEqual("TRAC-11111")
    expect(row.at(4).text()).toEqual("pending")
  })

  it('will allow selection of samples', () => {
    let input = wrapper.find('input')
    input.trigger('click')
    expect(input.element.checked).toEqual(true)
  })
})
