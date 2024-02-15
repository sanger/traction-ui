import Tube from '@/components/pacbio/PacbioLibraryTubeItem'
import { mount, router, createTestingPinia } from '@support/testHelper'
import { usePacbioRunCreateStore } from '@/stores/pacbioRunCreate'

/**
 * Helper method for mounting a component with a mock instance of pinia, with the given props.
 * This method also returns the wrapper and the store object for further testing.
 *
 * @param {*} - params to be passed to the createTestingPinia method for creating a mock instance of pinia
 * which includes
 * state - initial state of the store.
 * stubActions - boolean to stub actions or not.
 * plugins - plugins to be used while creating the mock instance of pinia.
 */
function mountWithStore({ state = {}, stubActions = false, plugins = [], props } = {}) {
  const wrapperObj = mount(Tube, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioRunCreate: { ...state },
          },
          stubActions,
          plugins,
        }),
      ],
    },
    props,
  })
  const storeObj = usePacbioRunCreateStore()
  return { wrapperObj, storeObj }
}

describe('PacbioLibraryTubeItem.vue', () => {
  let tube, wrapper, props

  describe('when valid', () => {
    beforeEach(() => {
      props = {
        id: '1',
        barcode: 'TRAC-1',
        sample_name: 'Sample1',
        group_id: 'TAG_1',
        volume: 10.2,
        concentration: 13.1,
        template_prep_kit_box_barcode: 'BB1',
        insert_size: 100,
        source_identifier: 'DN1S:A1',
        run_suitability: {
          ready_for_run: true,
          errors: [],
        },
      }

      const { wrapperObj } = mountWithStore({
        props,
        router,
      })

      wrapper = wrapperObj
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

    it('must have a insert-size', () => {
      expect(wrapper.find('[data-attribute=insert-size]').text()).toContain('100')
    })

    it('must have a sample_name', () => {
      expect(wrapper.find('[data-attribute=sample-name]').text()).toContain('Sample1')
    })
  })

  describe('when invalid', () => {
    beforeEach(() => {
      props = {
        id: '1',
        barcode: 'TRAC-1',
        sample_name: 'Sample1',
        group_id: 'TAG_1',
        run_suitability: {
          ready_for_run: false,
          errors: [
            {
              title: "can't be blank",
              detail: "insert_size - can't be blank",
              code: '100',
              source: {
                pointer: '/data/attributes/insert_size',
              },
            },
          ],
        },
        source_identifier: 'DN1S:A1',
      }

      const { wrapperObj } = mountWithStore({
        props,
        router,
      })

      wrapper = wrapperObj
      tube = wrapper.vm
    })

    it('reports the library is invalid', () => {
      expect(wrapper.text()).toContain('Library invalid. Click for more information')
    })

    it('reports more information when clicked', async () => {
      await wrapper.trigger('click')
      expect(wrapper.text()).toContain("insert_size - can't be blank")
    })
  })
})
