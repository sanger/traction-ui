import OntTagSetList from '@/components/ont/OntTagSetList.vue'
import { mount, store } from '@support/testHelper.js'

describe('OntTagSetList', () => {
  let wrapper
  const tagSets = {
    1: { id: '1', name: 'TagSet1', tags: [] },
    2: { id: '2', name: 'TagSet2', tags: [] },
    3: { id: '3', name: 'TagSet3', tags: [] },
  }

  describe('when there are some tag sets to show', () => {
    beforeEach(() => {
      store.state.traction.ont.pools.resources.tagSets = tagSets

      wrapper = mount(OntTagSetList, {
        store,
      })
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

      expect(store.state.traction.ont.pools.selected.tagSet.id).toEqual(tagSets['1'].id)
    })
  })

  describe('when there are no tag sets to show', () => {
    beforeEach(() => {
      store.state.traction.ont.pools.resources.tagSets = {}

      wrapper = mount(OntTagSetList, {
        store,
      })
    })

    it('wont show the list', () => {
      expect(wrapper.find('[data-type=tag-set-list]').exists()).toBeFalsy()
    })
  })

  describe('when there is an error', () => {
    beforeEach(() => {
      store.state.traction.ont.pools.resources.tagSets = {}

      wrapper = mount(OntTagSetList, {
        store,
      })

      wrapper.vm.showAlert('Bad stuff happened', 'danger')
    })

    it('should show an appropriate message', () => {
      expect(Object.values(store.state.traction.messages)).toContainEqual({
        type: 'danger',
        message: 'Bad stuff happened',
      })
    })
  })
})
