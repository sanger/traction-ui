import OntTagSetList from '@/components/ont/OntTagSetList.vue'
import { mountWithStore } from '@support/testHelper.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'
import useRootStore from '@/stores'

const tagSets = {
  1: { id: '1', name: 'TagSet1', tags: [] },
  2: { id: '2', name: 'TagSet2', tags: [] },
  3: { id: '3', name: 'TagSet3', tags: [] },
}

describe('OntTagSetList', () => {
  let wrapper, store

  describe('when there are some tag sets to show', () => {
    beforeEach(() => {
      ;({ wrapper, store } = mountWithStore(OntTagSetList, {
        initialState: {
          ontPoolCreate: {
            selected: {
              tagSet: { id: '1' },
            },
            resources: {
              tagSets,
            },
          },
        },
        createStore: () => useOntPoolCreateStore(),
      }))
    })

    it('shows a list of tag sets', () => {
      expect(wrapper.find('[data-type=tag-set-list]').findAll('option').length).toEqual(
        // will also include null value
        Object.keys(tagSets).length + 1,
      )
    })

    it('allows the user to select a tag set', async () => {
      const options = wrapper.find('[data-type=tag-set-list]').findAll('option')
      await options[1].setSelected()

      expect(store.selected.tagSet.id).toEqual(tagSets['1'].id)
    })
  })

  describe('when there are no tag sets to show', () => {
    beforeEach(() => {
      ;({ wrapper, store } = mountWithStore(OntTagSetList, {
        initialState: {
          ontPoolCreate: {
            selected: {
              tagSet: {},
            },
            resources: {
              tagSets: {},
            },
          },
        },
        createStore: () => useOntPoolCreateStore(),
      }))
    })
    it('wont show the list', () => {
      expect(wrapper.find('[data-type=tag-set-list]').exists()).toBeFalsy()
    })
  })

  describe.skip('when there is an error', () => {
    beforeEach(() => {
      ;({ wrapper, store } = mountWithStore(OntTagSetList, {
        initialState: {
          ontPoolCreate: {
            selected: {
              tagSet: { id: '1' },
            },
            resources: {
              tagSets: {},
            },
          },
        },
        createStore: () => useOntPoolCreateStore(),
      }))

      wrapper.vm.showAlert('Bad stuff happened', 'danger')
    })

    it('should show an appropriate message', () => {
      const rootStore = useRootStore()
      expect(Object.values(rootStore.messages)).toContainEqual({
        type: 'danger',
        message: 'Bad stuff happened',
      })
    })
  })
})
