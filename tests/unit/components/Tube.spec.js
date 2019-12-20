import { mount, localVue } from '../testHelper'
import Tube from '@/components/Tube'

describe('Tube.vue', () => {

  let tube, wrapper, props

  beforeEach(() => {
    props = { barcode: 'TRAC-1', sample_names: 'Sample1,Sample2', tag_oligos: 'ATGC,CGAT' }

    wrapper = mount(Tube, { 
      localVue, 
      propsData: props
    })

    tube = wrapper.vm
  })

  it('must have a barcode', () => {
    expect(tube.barcode).toEqual(props.barcode)
    expect(wrapper.find('.barcode').text()).toEqual(props.barcode)
  })

  it('must have some sample names', () => {
    expect(tube.sample_names).toEqual(props.sample_names)
    expect(wrapper.find('.sample_names').text()).toEqual(props.sample_names)
  })

  it('must have some tag oligos', () => {
    expect(tube.tag_oligos).toEqual(props.tag_oligos)
    expect(wrapper.find('.tag_oligos').text()).toEqual(props.tag_oligos)
  })

})