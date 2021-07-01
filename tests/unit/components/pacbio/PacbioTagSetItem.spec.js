import PacbioTagSetItem from '@/components/pacbio/PacbioTagSetItem'
import { localVue, mount, store } from '../../testHelper'

const tagSets = {
  '1': { id: '1', name: 'TagSet1', tags: ['1', '2', '3', '4', '5', '6'] },
  '2': { id: '2', name: 'TagSet2' },
  '3': { id: '3', name: 'TagSet3' },
}

// is this the best way to do this??
store.state.traction.pacbio.poolCreate.resources.tagSets = tagSets

const tags = {
  '1': { id: '1', groupId: 'Tag1' },
  '2': { id: '2', groupId: 'Tag2' },
  '3': { id: '3', groupId: 'Tag3' },
  '4': { id: '4', groupId: 'Tag4' },
  '5': { id: '5', groupId: 'Tag5' },
  '6': { id: '6', groupId: 'Tag6' },
  '7': { id: '7', groupId: 'Tag7' },
  '8': { id: '8', groupId: 'Tag8' },
  '9': { id: '9', groupId: 'Tag9' },
  '10': { id: '10', groupId: 'Tag10' },
  '11': { id: '11', groupId: 'Tag11' },
  '12': { id: '12', groupId: 'Tag12' },
}

store.state.traction.pacbio.poolCreate.resources.tags = tags

describe('PacbioTagSetSHow', () => {

  let wrapper

  describe('when there is a selected tag list', () => {

    beforeEach(() => {

      store.state.traction.pacbio.poolCreate.selected.tagSet = tagSets['1']

      wrapper = mount(PacbioTagSetItem, {
        localVue,
        store,
      })
    })
  
    it('has the selected tag set', () => {
      expect(wrapper.vm.tagSet).toEqual(tagSets['1'])
    })
  
    it('shows a list of tags', () => {
      expect(
        wrapper.find('[data-type=tag-set-item]').findAll('[data-attribute=group-id]').length,
      ).toEqual(tagSets['1'].tags.length)
    })
  
    it('shows the group id', () => {
      const groupIds = wrapper.findAll('[data-attribute=group-id]')
      expect(groupIds.at(0).text()).toEqual(tags['1'].groupId)
    })
  
    it('click on tag selects it', async () => {
      const groupIds = wrapper.findAll('[data-attribute=group-id]')
      await groupIds.at(0).trigger('click')
      await groupIds.at(1).trigger('click')
  
      const selected = wrapper.vm.selected
      expect(selected).toEqual(['1', '2'])
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
      const errorMessage = wrapper.find('[data-type=warning-message]')
      expect(errorMessage.text()).toMatch('There is no tag set selected')
    })
    
  })
  
})
