import PacbioTagSetList from '@/components/pacbio/PacbioTagSetList.vue'
import { mount, createTestingPinia } from '@support/testHelper.js'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'

const tagSets = {
  1: { id: '1', name: 'TagSet1', tags: [] },
  2: { id: '2', name: 'TagSet2', tags: [] },
  3: { id: '3', name: 'TagSet3', tags: [] },
}

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
  const wrapperObj = mount(PacbioTagSetList, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            pacbioPoolCreate: state,
          },
          stubActions,
          plugins,
        }),
      ],
    },
    props,
  })
  const storeObj = usePacbioPoolCreateStore()
  return { wrapperObj, storeObj }
}

describe('PacbioTagSetList', () => {
  let wrapper, store

  describe('when there are some tag sets to show', () => {
    beforeEach(() => {
      const plugins = [
        ({ store }) => {
          if (store.$id === 'pacbioRoot') {
            store.tagSets = tagSets
          }
        },
      ]
      const { wrapperObj, storeObj } = mountWithStore({
        state: {
          selected: {
            tagSet: { id: '1' },
          },
        },
        plugins,
      })
      wrapper = wrapperObj
      store = storeObj
    })

    it('shows a list of tag sets', () => {
      expect(wrapper.find('[data-type=tag-set-list]').findAll('option').length).toEqual(
        // will also include null value
        Object.keys(tagSets).length + 1,
      )
    })

    it('allows the user to select a tag set', async () => {
      const options = wrapper.find('[data-type=tag-set-list]').findAll('option')
      // bizarrely if you try to select the first option it returns null
      await options[1].setSelected()
      expect(store.selected.tagSet.id).toEqual(tagSets['1'].id)
    })
  })

  describe('when there are no tag sets to show', () => {
    beforeEach(() => {
      const plugins = [
        ({ store }) => {
          if (store.$id === 'pacbioRoot') {
            store.tagSets = {}
          }
        },
      ]
      const { wrapperObj, storeObj } = mountWithStore({ plugins })
      wrapper = wrapperObj
      store = storeObj
    })

    it('wont show the list', () => {
      expect(wrapper.find('[data-type=tag-set-list]').exists()).toBeFalsy()
    })
  })
})
