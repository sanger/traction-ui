import PacbioPoolLibraryList from '@/components/pacbio/PacbioPoolLibraryList'
import { mount, store, localVue } from 'testHelper'

const requests = [
  {
    id: '1',
    sample_name: 'Sample1',
    selected: true,
  },
  {
    id: '2',
    sample_name: 'Sample2',
    selected: true,
  },
  {
    id: '3',
    sample_name: 'Sample3',
    selected: true,
  },
]

// TODO: This is a definite smell. We should not need this here.
const tagSet = {
  id: '1',
  name: 'TagSet1',
  tags: ['1', '2', '3'],
}

const tags = {
  1: { id: '1', name: 'tag1' },
  2: { id: '2', name: 'tag2' },
  3: { id: '3', name: 'tag3' },
}

store.state.traction.pacbio.poolCreate.selected.requests = requests
store.state.traction.pacbio.poolCreate.selected.tagSet = tagSet
store.state.traction.pacbio.poolCreate.resources.tagSets = { 1: tagSet }
store.state.traction.pacbio.poolCreate.resources.tags = tags

describe('PacbioPoolLibraryList.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PacbioPoolLibraryList, {
      store,
      localVue,
    })
  })

  it('should have a list of libraries', () => {
    expect(wrapper.findAll('[data-type=pool-library-edit]').length).toEqual(requests.length)
  })
})
