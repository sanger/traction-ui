import { mount, localVue } from '../testHelper'
import Tube from '@/components/Tube'

describe('Tube.vue', () => {

  let tube, wrapper, props

  beforeEach(() => {
    props = { barcode: 'TRAC-1', sample_names: 'Sample1,Sample2', tag_group_ids: '1,2' }

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

  it('must have some tag group ids', () => {
    expect(tube.tag_group_ids).toEqual(props.tag_group_ids)
    expect(wrapper.find('.tag_group_ids').text()).toEqual(props.tag_group_ids)
  })

})