import Tube from '@/components/pacbio/PacbioPoolTubeItem'
import { localVue, mount } from 'testHelper'

describe('LibraryTubeItem.vue', () => {
  let tube, wrapper, props

  beforeEach(() => {
    props = {
      barcode: 'TRAC-1',
      libraries: [{ id: '1', sample_name: 'Sample1', group_id: 'TAG_1' }],
    }

    wrapper = mount(Tube, {
      localVue,
      propsData: props,
    })

    tube = wrapper.vm
  })

  it('must have a barcode', () => {
    expect(tube.barcode).toEqual(props.barcode)
    expect(wrapper.find('.barcode').text()).toContain(props.barcode)
  })

  it('must have some libraries', () => {
    expect(tube.libraries).toEqual(props.libraries)
  })
})
