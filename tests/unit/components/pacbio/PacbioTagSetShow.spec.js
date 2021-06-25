import PacbioTagSetSHow from '@/components/pacbio/PacbioTagSetShow'
import { localVue, mount } from '../../testHelper'

const tags = [
  { id: 1, groupId: 'Tag1'},
  { id: 2, groupId: 'Tag2'},
  { id: 3, groupId: 'Tag3'},
  { id: 4, groupId: 'Tag4'},
  { id: 5, groupId: 'Tag5'},
  { id: 6, groupId: 'Tag6'},
  { id: 7, groupId: 'Tag7'},
  { id: 8, groupId: 'Tag8'},
  { id: 9, groupId: 'Tag9'},
  { id: 10, groupId: 'Tag10'},
  { id: 11, groupId: 'Tag11'},
  { id: 12, groupId: 'Tag12'},
]

describe('PacbioTagSetSHow', () => {

  let wrapper

  beforeEach(() => {
    wrapper = mount(PacbioTagSetSHow, {
      localVue,
      data() {
        return {
          tags
        }
      }
    })
  })

  it('shows a list of tag sets', () => {
    expect(wrapper.find('[data-type=tag-list]').findAll('[data-attribute=group-id]').length).toEqual(tags.length)
  })

  it('shows the group id', () => {
    const groupIds = wrapper.findAll('[data-attribute=group-id]')
    expect(groupIds.at(0).text()).toEqual(tags[0].groupId)
  })

  it('click on tag selects it', async () => {
    const groupIds = wrapper.findAll('[data-attribute=group-id]')
    await groupIds.at(0).trigger('click')
    await groupIds.at(1).trigger('click')
    
    const selected = wrapper.vm.selected
    expect(selected).toEqual([1,2])
  })

})