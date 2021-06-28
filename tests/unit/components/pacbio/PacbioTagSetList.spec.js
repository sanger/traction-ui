import PacbioTagSetList from '@/components/pacbio/PacbioTagSetList'
import { localVue, mount } from '../../testHelper'

const tagSets = [
  { value: 1, text: 'TagSet1'},
  { value: 2, text: 'TagSet2'},
  { value: 3, text: 'TagSet3'}
]

describe('PacbioTagSetList', () => {

  let wrapper

  beforeEach(() => {
    wrapper = mount(PacbioTagSetList, {
      localVue,
      data() {
        return {
          tagSets
        }
      }
    })
  })

  it('shows a list of tag sets', () => {
    expect(wrapper.find('[data-type=tag-set-list]').findAll('option').length).toEqual(tagSets.length)
  })

  it('allows the user to select a tag set', async () => {
    const options = wrapper.find('[data-type=tag-set-list]').findAll('option')
    // bizarrely if you try to select the first option it returns null
    await options.at(1).setSelected()
    expect(wrapper.vm.selected).toEqual(2)
  })

})