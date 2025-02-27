import PacbioTagSetList from '@/components/pacbio/PacbioTagSetList.vue'
import { mountWithStore } from '@support/testHelper.js'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'

const tagSets = {
  1: { id: '1', name: 'TagSet1', tags: [] },
  2: { id: '2', name: 'TagSet2', tags: [] },
  3: { id: '3', name: 'TagSet3', tags: [] },
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
      ;({ wrapper, store } = mountWithStore(PacbioTagSetList, {
        initialState: {
          pacbioPoolCreate: {
            selected: {
              tagSet: { id: '1' },
            },
          },
        },
        plugins,
        createStore: () => usePacbioPoolCreateStore(),
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
      ;({ wrapper, store } = mountWithStore(PacbioTagSetList, {
        initialState: {
          pacbioPoolCreate: {
            selected: {
              tagSet: { id: '1' },
            },
          },
        },
        plugins,
        createStore: () => usePacbioPoolCreateStore(),
      }))
    })

    it('wont show the list', () => {
      expect(wrapper.find('[data-type=tag-set-list]').exists()).toBeFalsy()
    })
  })
})
