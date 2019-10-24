import { mount, localVue } from '../testHelper'
import Well from '@/components/Well'

describe('Well.vue', () => {

  let well, wrapper, props

  beforeEach(() => {
    props = { position: 'A1' }
    wrapper = mount(Well, { propsData: props, localVue })
    well = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('Well')
  })

  it('must have a position', () => {
    expect(well.position).toEqual(props.position)
  })

  describe('entering data', () => {
    it('movie time', () => {
      let select = wrapper.find({ref: 'movieTime'}).element
      select.value = 20
      select.dispatchEvent(new Event('change'))
      expect(well.movieTime).toEqual('20')
    })

    it('insert size', () => {
      let input = wrapper.find({ref: 'insertSize'})
      input.setValue(20)
      expect(well.insertSize).toEqual('20')
    })

    it('on plate loading concentration', () => {
      let input = wrapper.find({ref: 'onPlateLoadingConc'})
      input.setValue(20)
      expect(well.onPlateLoadingConc).toEqual('20')
    })

    it('library barcode', () => {
      let input = wrapper.find({ref: 'libraryBarcode'})
      input.setValue('DN1234567')
      expect(well.libraryBarcode).toEqual('DN1234567')
    })

  })

  describe('setBarcode', () => {
    
  })

})