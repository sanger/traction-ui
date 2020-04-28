import OntLibraries from '@/views/ont/OntLibraries'
import { mount, localVue } from '../../testHelper'

describe('OntLibraries.vue', () => {
  let wrapper, libraries, librariesData

  beforeEach(() => {
    librariesData = [
      { id: 1, tube_barcode: 'TRAC-2-1', plate_barcode: 'TRAC-1-1', pool: 1, wells: 'A1-H3', tag_set: 24 },
      { id: 2, tube_barcode: 'TRAC-2-2', plate_barcode: 'TRAC-1-1', pool: 2, wells: 'A4-H6', tag_set: 24 },
      { id: 3, tube_barcode: 'TRAC-2-3', plate_barcode: 'TRAC-1-1', pool: 3, wells: 'A7-H9', tag_set: 24 },
      { id: 4, tube_barcode: 'TRAC-2-4', plate_barcode: 'TRAC-1-1', pool: 4, wells: 'A10-H12', tag_set: 24 },
      { id: 5, tube_barcode: 'TRAC-2-5', plate_barcode: 'TRAC-1-2', pool: 1, wells: 'A1-H12', tag_set: 96 },
    ]

    wrapper = mount(OntLibraries, {
      localVue,
      stubs: {
        OntPlate: true
      },
      data() {
        return {
          libraries: librariesData
        }
      }
    })
    libraries = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('OntLibraries')
  })

  it('will have fields', () => {
    expect(libraries.fields).toEqual(['id', 'tube_barcode', 'plate_barcode', 'pool', 'wells', 'tag_set'])
  })

  it('will have a table', () => {
    expect(wrapper.contains('table')).toBe(true)
  })

  it('will have a table with libraries', () => {
    expect(wrapper.find('tbody').findAll('tr').length).toEqual(librariesData.length)
  })

})