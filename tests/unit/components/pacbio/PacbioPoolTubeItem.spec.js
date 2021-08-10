import Tube from '@/components/pacbio/PacbioPoolTubeItem'
import { localVue, mount } from 'testHelper'

describe('LibraryTubeItem.vue', () => {
  let tube, wrapper, props

  const unknownField = 'Unknown'

  describe('when valid', () => {
    beforeEach(() => {
      props = {
        barcode: 'TRAC-1',
        libraries: [{ id: '1', sample_name: 'Sample1', group_id: 'TAG_1' }],
        volume: 10.2,
        concentration: 13.1,
        template_prep_kit_box_barcode: 'BB1',
        fragment_size: 100,
        source_identifier: 'DN1S:A1',
      }

      wrapper = mount(Tube, {
        localVue,
        propsData: props,
      })

      tube = wrapper.vm
    })

    it('must have a barcode', () => {
      expect(tube.barcode).toEqual(props.barcode)
      expect(wrapper.find('[data-attribute=barcode]').text()).toContain(props.barcode)
    })

    it('must have a source identifier', () => {
      expect(wrapper.find('[data-attribute=source-identifier]').text()).toContain('DN1S:A1')
    })

    it('must have a source volume', () => {
      expect(wrapper.find('[data-attribute=volume]').text()).toContain('10.2')
    })

    it('must have a concentration', () => {
      expect(wrapper.find('[data-attribute=concentration]').text()).toContain('13.1')
    })

    it('must have a template prep kit box barcode', () => {
      expect(wrapper.find('[data-attribute=template-prep-kit-box-barcode]').text()).toContain('BB1')
    })

    it('must have a fragment-size', () => {
      expect(wrapper.find('[data-attribute=fragment-size]').text()).toContain('100')
    })

    it('must have some libraries', () => {
      expect(tube.libraries).toEqual(props.libraries)
    })
  })

  describe('when invalid', () => {
    beforeEach(() => {
      props = {
        barcode: 'TRAC-1',
        libraries: [{ id: '1', sample_name: 'Sample1', group_id: 'TAG_1' }],
        source_identifier: 'DN1S:A1',
      }

      wrapper = mount(Tube, {
        localVue,
        propsData: props,
      })

      tube = wrapper.vm
    })

    it('reports the pool is invalid', () => {
      expect(wrapper.text()).toContain('Pool invalid. Click for more information')
    })

    it('reports more information when clicked', async () => {
      await wrapper.trigger('click')
      expect(wrapper.find('[data-attribute=volume]').text()).toContain(unknownField)
    })
  })
})
