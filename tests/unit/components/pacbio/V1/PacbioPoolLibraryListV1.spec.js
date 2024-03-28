import PacbioPoolLibraryList from '@/components/pacbio/V1/PacbioPoolLibraryListV1.vue'
import { mount, store } from '@support/testHelper.js'

const libraryAttributes = {
  template_prep_kit_box_barcode: 'ABC1',
  tag_id: '1',
  volume: '1.0',
  concentration: '10.0',
  insert_size: '100',
  run_suitability: {
    ready_for_run: true,
    errors: [],
  },
}

const requests = {
  1: { id: 1, well: '1', plate: '1' },
  2: { id: 2, well: '2', plate: '1' },
  3: { id: 3, well: '3', plate: '1' },
}

const libraries = {
  _1: { pacbio_request_id: '1', ...libraryAttributes },
  _2: { pacbio_request_id: '2', ...libraryAttributes, tag_id: '2' },
  _3: { pacbio_request_id: '3', ...libraryAttributes, tag_id: '3' },
}

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

const wells = {
  1: { id: 1, position: 'A1' },
  2: { id: 2, position: 'B1' },
  3: { id: 3, position: 'C1' },
}

store.state.traction.pacbio.poolCreate.selected.tagSet = tagSet
store.state.traction.pacbio.poolCreate.resources.tagSets = { 1: tagSet }
store.state.traction.pacbio.poolCreate.resources.tags = tags
store.state.traction.pacbio.poolCreate.resources.requests = requests
store.state.traction.pacbio.poolCreate.resources.wells = wells

describe('PacbioPoolLibraryList.vue', () => {
  it('should have a list of libraries', () => {
    store.state.traction.pacbio.poolCreate.libraries = libraries
    const wrapper = mount(PacbioPoolLibraryList, {
      store,
      props: {
        notify: () => {},
      },
    })
    expect(wrapper.findAll('[data-type=pool-library-edit]').length).toEqual(
      Object.values(libraries).length,
    )
  })
})
