import PacbioTagSetList from '@/components/pacbio/PacbioTagSetList'
import { localVue, mount, store } from 'testHelper'

const tagSets = {
  '1': { id: '1', name: 'TagSet1', tags: [] },
  '2': { id: '2', name: 'TagSet2', tags: [] },
  '3': { id: '3', name: 'TagSet3', tags: [] },
}

describe('PacbioTagSetList', () => {
  let wrapper

  describe('when there are some tag sets to show', () => {
    beforeEach(() => {
      store.state.traction.pacbio.poolCreate.resources.tagSets = tagSets

      wrapper = mount(PacbioTagSetList, {
        localVue,
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
      // bizarrely if you try to select the first option it returns null
      await options.at(1).setSelected()
      expect(store.state.traction.pacbio.poolCreate.selected.tagSet.id).toEqual(tagSets['1'].id)
    })
  })

  describe('when there are no tag sets to show', () => {
    beforeEach(() => {
      store.state.traction.pacbio.poolCreate.resources.tagSets = {}

      wrapper = mount(PacbioTagSetList, {
        localVue,
        store,
      })
    })

    it('wont show the list', () => {
      expect(wrapper.find('[data-type=tag-set-list]').exists()).toBeFalsy()
    })
  })

  describe('when there is an error', () => {
    beforeEach(() => {
      store.state.traction.pacbio.poolCreate.resources.tagSets = {}

      wrapper = mount(PacbioTagSetList, {
        localVue,
        store,
      })

      wrapper.vm.showAlert('Bad stuff happened', 'danger')
    })

    it('should show an appropriate message', () => {
      expect(store.state.traction.messages).toContainEqual({
        type: 'danger',
        message: 'Bad stuff happened',
      })
    })
  })
})
