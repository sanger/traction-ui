import OntPoolLibraryList from '@/components/ont/OntPoolLibraryList.vue'
import { mountWithStore } from '@support/testHelper.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'

const libraryAttributes = {
  kit_barcode: 'ABC1',
  tag_id: '1',
  volume: '1.0',
  concentration: '10.0',
  insert_size: '100',
}

const requests = {
  1: { id: 1, well: '1', plate: '1' },
  2: { id: 2, well: '2', plate: '1' },
  3: { id: 3, well: '3', plate: '1' },
}

const libraries = {
  1: { ont_request_id: '1', ...libraryAttributes },
  2: { ont_request_id: '2', ...libraryAttributes, tag_id: '2' },
  3: { ont_request_id: '3', ...libraryAttributes, tag_id: '3' },
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

describe('OntPoolLibraryList.vue', () => {
  it('should have a list of libraries', () => {
    const { wrapper } = mountWithStore(OntPoolLibraryList, {
      initialState: {
        ontPoolCreate: {
          resources: {
            libraries,
            requests,
            wells,
            tags,
            tagSets: { 1: tagSet },
          },
          selected: {
            tagSet: tagSet,
          },
          pooling: {
            libraries,
          },
        },
      },
      createStore: () => useOntPoolCreateStore(),
    })
    expect(wrapper.findAll('[data-type=pool-library-edit]').length).toEqual(
      Object.values(libraries).length,
    )
  })
})
