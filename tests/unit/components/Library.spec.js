import { mount, localVue } from '../testHelper'
import Library from '@/components/Library'

describe('Library', () => {

  let wrapper, library, props, input

  beforeEach(() => {
    props = { id: 1, tube: { id: 1, barcode: 'TRAC-1'} }
    wrapper = mount(Library, { localVue, propsData: props } )
    library = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Library')
  })

  it('can have an id', () => {
    expect(library.id).toEqual(1)
  })

  it('can have a tube', () => {
    expect(library.tube).toEqual(props.tube)
  })

  describe('barcodes', () => {

    it('will populate the barcode from the tube', () => {
      expect(library.barcode).toEqual(props.tube.barcode)
    })

    it('will allow the user to scan in a barcopde', () => {
      input = wrapper.find('#barcode')
      input.setValue('TRAC-2')
      expect(library.barcode).toEqual('TRAC-2')
    })

  })
})