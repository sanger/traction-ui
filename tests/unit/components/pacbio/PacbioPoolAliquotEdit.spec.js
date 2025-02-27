import { mountWithStore } from '@support/testHelper.js'
import { createUsedAliquot } from '@/stores/utilities/usedAliquot.js'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import PacbioPoolAliquotEdit from '@/components/pacbio/PacbioPoolAliquotEdit.vue'
import { expect } from 'vitest'

const request = {
  id: '1',
  sample_name: 'Sample1',
  source_identifier: 'DN1:A1',
  source_id: '1',
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
function mountPacbioPoolAliquotEdit({ state = {}, props } = {}) {
  return mountWithStore(PacbioPoolAliquotEdit, {
    initialState: {
      pacbioRoot: {
        tagSets: { 1: tagSet },
        tags,
      },
      pacbioPoolCreate: state,
    },
    props,
    stubs: {
      PacbioPoolLibraryList: true,
    },
    createStore: () => usePacbioPoolCreateStore(),
  })
}

// TODO: The tag list would probably better done using a separate component and an emit
// but that is a bigger job
describe('PacbioPoolAliquotEdit.vue', () => {
  let wrapper, store

  describe('valid', () => {
    beforeEach(() => {
      ;({ wrapper, store } = mountPacbioPoolAliquotEdit({
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
      }))
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
        expect(store.validateUsedAliquot).toBeCalled()
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
      ;({ wrapper } = mountPacbioPoolAliquotEdit({
        state: {
          selected: {
            tagSet: { id: tagSet.id },
          },
          used_aliquots: { _1: { ...usedAliquot, errors: { tag_id: 'must be present' } } },
        },
        props,
      }))

      expect(wrapper.find('[data-attribute=tag-id-error]').text()).toEqual('must be present')
    })

    it('volume', () => {
      ;({ wrapper } = mountPacbioPoolAliquotEdit({
        state: {
          selected: {
            tagSet: { id: tagSet.id },
          },
          used_aliquots: { _1: { ...usedAliquot, errors: { volume: 'must be present' } } },
        },
        props,
      }))
      expect(wrapper.find('[data-attribute=volume-error]').text()).toEqual('must be present')
    })

    it('concentration', () => {
      ;({ wrapper } = mountPacbioPoolAliquotEdit({
        state: {
          selected: {
            tagSet: { id: tagSet.id },
          },
          used_aliquots: { _1: { ...usedAliquot, errors: { concentration: 'must be present' } } },
        },
        props,
      }))

      expect(wrapper.find('[data-attribute=concentration-error]').text()).toEqual('must be present')
    })

    it('insert size', () => {
      ;({ wrapper } = mountPacbioPoolAliquotEdit({
        state: {
          selected: {
            tagSet: { id: tagSet.id },
          },
          used_aliquots: { _1: { ...usedAliquot, errors: { insert_size: 'must be present' } } },
        },
        props,
      }))

      expect(wrapper.find('[data-attribute=insert-size-error]').text()).toEqual('must be present')
    })

    it('displays the selected border', () => {
      ;({ wrapper } = mountPacbioPoolAliquotEdit({
        state: {
          selected: {
            tagSet: { id: tagSet.id },
          },
          used_aliquots: { _1: { ...usedAliquot, errors: { insert_size: 'must be present' } } },
        },
        props: { ...props, selected: true },
      }))
      expect(wrapper.classes()).toContain('cursor-pointer')
      expect(wrapper.classes()).toContain('border-4')
      expect(wrapper.classes()).toContain('border-purple-500')
    })

    it('emits an event when user clicks the table', async () => {
      ;({ wrapper } = mountPacbioPoolAliquotEdit({
        state: {
          selected: {
            tagSet: { id: tagSet.id },
          },
          used_aliquots: { _1: { ...usedAliquot, errors: { insert_size: 'must be present' } } },
        },
        props,
      }))
      wrapper.find('[data-attribute="request-sample-name"]').trigger('click')
      expect(wrapper.emitted()).toHaveProperty('aliquotSelected')
      //check emitted value is true
      expect(wrapper.emitted()['aliquotSelected'][0]).toEqual([true])
    })
    it('emits an event with false value when user clicks the table', async () => {
      ;({ wrapper } = mountPacbioPoolAliquotEdit({
        state: {
          selected: {
            tagSet: { id: tagSet.id },
          },
          used_aliquots: { _1: { ...usedAliquot, errors: { insert_size: 'must be present' } } },
        },
        props: { ...props, selected: true },
      }))
      wrapper.find('[data-attribute="request-sample-name"]').trigger('click')
      //check emitted value is false
      expect(wrapper.emitted()['aliquotSelected'][0]).toEqual([false])
    })
  })
})
