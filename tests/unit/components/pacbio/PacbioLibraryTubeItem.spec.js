import Tube from '@/components/pacbio/PacbioLibraryTubeItem'
import { localVue, mount } from '../../testHelper'

describe('LibraryTubeItem.vue', () => {
  let tube, wrapper, props

  beforeEach(() => {
    props = { barcode: 'TRAC-1', sample_name: 'Sample1,Sample2', tag_group_id: '1' }

    wrapper = mount(Tube, {
      localVue,
      propsData: props,
    })

    tube = wrapper.vm
  })

  it('must have a barcode', () => {
    expect(tube.barcode).toEqual(props.barcode)
    expect(wrapper.find('.barcode').text()).toEqual(props.barcode)
  })

  it('must have some sample names', () => {
    expect(tube.sample_name).toEqual(props.sample_name)
    expect(wrapper.find('.sample_name').text()).toEqual(props.sample_name)
  })

  it('must have some tag group ids', () => {
    expect(tube.tag_group_id).toEqual(props.tag_group_id)
    expect(wrapper.find('.tag_group_id').text()).toEqual(props.tag_group_id)
  })
})
