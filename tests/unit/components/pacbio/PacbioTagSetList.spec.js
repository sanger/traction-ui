import PacbioTagSetList from '@/components/pacbio/PacbioTagSetList'
import { localVue, mount, store } from '../../testHelper'

const tagSets = {
  "1": { id: "1", name: "TagSet1"},
  "2": { id: "2", name: "TagSet2"},
  "3": { id: "3", name: "TagSet3"}
}

// is this the best way to do this??
store.state.traction.pacbio.poolCreate.resources.tagSets = tagSets

describe('PacbioTagSetList', () => {

  let wrapper

  beforeEach(() => {
    wrapper = mount(PacbioTagSetList, {
      localVue,
      store
    })
  })

  it('shows a list of tag sets', () => {
    expect(wrapper.find('[data-type=tag-set-list]').findAll('option').length).toEqual(Object.keys(tagSets).length)
  })

  it('allows the user to select a tag set', async () => {
    const options = wrapper.find('[data-type=tag-set-list]').findAll('option')
    // bizarrely if you try to select the first option it returns null
    await options.at(1).setSelected()
    expect(wrapper.vm.selected).toEqual("2")
    expect(store.state.traction.pacbio.poolCreate.selected.tagSet).toEqual("2")
  })

})