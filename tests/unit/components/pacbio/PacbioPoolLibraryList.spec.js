import PacbioPoolLibraryList from '@/components/pacbio/PacbioPoolLibraryList'
import { mount, store, localVue } from 'testHelper'

const libraryAttributes = {
  template_prep_kit_box_barcode: 'ABC1',
  tag_id: '1',
  volume: '1.0',
  concentration: '10.0',
  fragment_size: '100',
}

const requests = {
  '1': { id: 1 },
  '2': { id: 2 },
  '3': { id: 3 },
}

const libraries = {
  _1: { pacbio_request_id: '1', ...libraryAttributes },
  _2: { pacbio_request_id: '2', ...libraryAttributes, tag_id: '2' },
  _3: { pacbio_request_id: '3', ...libraryAttributes, tag_id: '3' },
}

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

store.state.traction.pacbio.poolCreate.selected.tagSet = tagSet
store.state.traction.pacbio.poolCreate.resources.tagSets = { 1: tagSet }
store.state.traction.pacbio.poolCreate.resources.tags = tags
store.state.traction.pacbio.poolCreate.resources.requests = requests

describe('PacbioPoolLibraryList.vue', () => {
  it('should have a list of libraries', () => {
    store.state.traction.pacbio.poolCreate.libraries = libraries
    const wrapper = mount(PacbioPoolLibraryList, {
      store,
      localVue,
    })
    expect(wrapper.findAll('[data-type=pool-library-edit]').length).toEqual(
      Object.values(libraries).length,
    )
  })
})
