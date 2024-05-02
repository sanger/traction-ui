import { mount, createTestingPinia } from '@support/testHelper.js'
import { createUsedAliquot } from '@/stores/utilities/pool.js'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import PacbioPoolAliquotEdit from '@/components/pacbio/PacbioPoolAliquotEdit.vue'

const request = {
  id: '1',
  sample_name: 'Sample1',
  source_identifier: 'DN1:A1',
}

const tagSet = {
  id: '1',
  name: 'TagSet1',
  tags: ['1', '2', '3'],
}

const tags = {
  1: { id: '1', group_id: 'tag1' },
  2: { id: '2', group_id: 'tag2' },
  3: { id: '3', group_id: 'tag3' },
}

const usedAliquot = createUsedAliquot({ source_id: '1', request: '1' })

/**
 * Helper method for mounting a component with a mock instance of pinia, with the given props.
 * This method also returns the wrapper and the store object for further testing.
 *
 * @param {*} - params to be passed to the createTestingPinia method for creating a mock instance of pinia
 * which includes
 * state - initial state of the store
 * stubActions - boolean to stub actions or not.
 * plugins - plugins to be used while creating the mock instance of pinia.
 */
function mountWithStore({ state = {}, stubActions = false, plugins = [], props } = {}) {
  const wrapperObj = mount(PacbioPoolAliquotEdit, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioRoot: {
              tagSets: { 1: tagSet },
              tags,
            },
            pacbioPoolCreate: state,
          },
          stubActions,
          plugins,
        }),
      ],
    },
    props,
    stubs: {
      PacbioPoolLibraryList: true,
    },
  })
  const storeObj = usePacbioPoolCreateStore()
  return { wrapperObj, storeObj }
}

// TODO: The tag list would probably better done using a separate component and an emit
// but that is a bigger job
describe('PacbioPoolAliquotEditV1.vue', () => {
  let wrapper, store

  describe('valid', () => {
    beforeEach(() => {
      const { wrapperObj, storeObj } = mountWithStore({
        state: {
          selected: {
            tagSet: { id: tagSet.id },
          },
          used_aliquots: { _1: usedAliquot },
        },
        props: {
          request,
          notify: () => {},
        },
      })
      wrapper = wrapperObj
      store = storeObj
    })

    it('will have a request', () => {
      expect(wrapper.vm.request).toEqual(request)
    })

    it('will have a sample name', () => {
      expect(wrapper.find('[data-attribute=request-sample-name]').text()).toEqual('Sample1')
    })

    it('will have a source identifier', () => {
      expect(wrapper.find('[data-attribute=request-source-identifier]').text()).toEqual('DN1:A1')
    })

    it('will have a list of tags', () => {
      expect(wrapper.find('[data-type=tag-list]').findAll('option').length).toEqual(
        // will also include null value
        tagSet.tags.length + 1,
      )
    })

    it('each tag option will have some text', () => {
      expect(wrapper.vm.tagListOptions[1].text).not.toBeNull()
    })

    describe('when the user selects a tag', () => {
      it('will update the tag_id', async () => {
        const options = wrapper.find('[data-type=tag-list]').findAll('option')
        await options[1].setSelected()
        expect(store.used_aliquots['_1'].tag_id).toEqual('1')
      })
    })

    describe('input', () => {
      it('template prep kit box barcode id', async () => {
        const input = wrapper.find('[data-attribute=template-prep-kit-box-barcode]')
        await input.setValue('017865101789500022821')
        expect(store.used_aliquots['_1'].template_prep_kit_box_barcode).toEqual(
          '017865101789500022821',
        )
      })

      it('volume', async () => {
        const input = wrapper.find('[data-attribute=volume]')
        await input.setValue('10.0')
        expect(store.used_aliquots['_1'].volume).toEqual('10.0')
      })

      it('concentration', async () => {
        const input = wrapper.find('[data-attribute=concentration]')
        await input.setValue('2.4')
        expect(store.used_aliquots['_1'].concentration).toEqual('2.4')
      })

      it('insert size', async () => {
        const input = wrapper.find('[data-attribute=insert-size]')
        await input.setValue('100')
        expect(store.used_aliquots['_1'].insert_size).toEqual('100')
      })
    })
  })

  describe('invalid', () => {
    const props = {
      id: 1,
      request,
      notify: () => {},
    }

    it('tag id', () => {
      const { wrapperObj } = mountWithStore({
        state: {
          selected: {
            tagSet: { id: tagSet.id },
          },
          used_aliquots: { _1: { ...usedAliquot, errors: { tag_id: 'must be present' } } },
        },
        props,
      })

      expect(wrapperObj.find('[data-attribute=tag-id-error]').text()).toEqual('must be present')
    })

    it('volume', () => {
      const { wrapperObj } = mountWithStore({
        state: {
          selected: {
            tagSet: { id: tagSet.id },
          },
          used_aliquots: { _1: { ...usedAliquot, errors: { volume: 'must be present' } } },
        },
        props,
      })
      expect(wrapperObj.find('[data-attribute=volume-error]').text()).toEqual('must be present')
    })

    it('concentration', () => {
      const { wrapperObj } = mountWithStore({
        state: {
          selected: {
            tagSet: { id: tagSet.id },
          },
          used_aliquots: { _1: { ...usedAliquot, errors: { concentration: 'must be present' } } },
        },
        props,
      })

      expect(wrapperObj.find('[data-attribute=concentration-error]').text()).toEqual(
        'must be present',
      )
    })

    it('insert size', () => {
      const { wrapperObj } = mountWithStore({
        state: {
          selected: {
            tagSet: { id: tagSet.id },
          },
          used_aliquots: { _1: { ...usedAliquot, errors: { insert_size: 'must be present' } } },
        },
        props,
      })

      expect(wrapperObj.find('[data-attribute=insert-size-error]').text()).toEqual(
        'must be present',
      )
    })
  })
})
