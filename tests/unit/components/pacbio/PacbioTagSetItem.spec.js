import PacbioTagSetItem from '@/components/pacbio/PacbioTagSetItem'
import { localVue, mount, store } from '@support/testHelper'

const tagSets = {
  1: { id: '1', name: 'TagSet1', tags: ['1', '2', '3', '4', '5', '6'] },
  2: { id: '2', name: 'TagSet2' },
  3: { id: '3', name: 'TagSet3' },
}

// is this the best way to do this??
store.state.traction.pacbio.poolCreate.resources.tagSets = tagSets

const tags = {
  1: { id: '1', group_id: 'Tag1' },
  2: { id: '2', group_id: 'Tag2' },
  3: { id: '3', group_id: 'Tag3' },
  4: { id: '4', group_id: 'Tag4' },
  5: { id: '5', group_id: 'Tag5' },
  6: { id: '6', group_id: 'Tag6' },
  7: { id: '7', group_id: 'Tag7' },
  8: { id: '8', group_id: 'Tag8' },
  9: { id: '9', group_id: 'Tag9' },
  10: { id: '10', group_id: 'Tag10' },
  11: { id: '11', group_id: 'Tag11' },
  12: { id: '12', group_id: 'Tag12' },
}

const expectedTagSet = { ...tagSets['1'], tags: Object.values(tags).slice(0, 6) }

store.state.traction.pacbio.poolCreate.resources.tags = tags

describe('PacbioTagSetItem', () => {
  let wrapper

  describe('when there is a selected tag list', () => {
    beforeEach(() => {
      store.commit('traction/pacbio/poolCreate/selectTagSet', { id: '1' })

      wrapper = mount(PacbioTagSetItem, {
        localVue,
        store,
      })
    })

    it('has the selected tag set', () => {
      expect(wrapper.vm.selectedTagSet).toEqual(expectedTagSet)
    })

    it('shows the tag set name', () => {
      const name = wrapper.find('[data-attribute=tag-set-name]')
      expect(name.text()).toMatch(tagSets['1'].name)
    })

    it('shows a list of tags', () => {
      expect(
        wrapper.find('[data-type=tag-set-item]').findAll('[data-attribute=group-id]').length,
      ).toEqual(tagSets['1'].tags.length)
    })

    it('shows the group id', () => {
      const groupIds = wrapper.findAll('[data-attribute=group-id]')
      expect(groupIds.at(0).text()).toEqual(tags['1'].group_id)
    })
  })

  describe('when there is no selected tag list', () => {
    beforeEach(() => {
      store.state.traction.pacbio.poolCreate.selected.tagSet = {}

      wrapper = mount(PacbioTagSetItem, {
        localVue,
        store,
      })
    })

    it('wont show the the tags', () => {
      expect(wrapper.find('[data-type=tag-set-item]').exists()).toBeFalsy()
    })
    it('should show an appropriate message', () => {
      const message = wrapper.find('[data-attribute=tag-set-name-placeholder]')
      expect(message.text()).toMatch('No tag set selected')
    })
  })
})
