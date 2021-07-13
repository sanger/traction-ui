import mutations from '@/store/traction/pacbio/poolCreate/mutations'
import defaultState from '@/store/traction/pacbio/poolCreate/state'
import { Data } from 'testHelper'
import { dataToObjectById } from '@/api/JsonApi'

describe('mutations.js', () => {
  const {
    selectPlate,
    selectTagSet,
    selectRequest,
    populatePlates,
    populateWells,
    populateRequests,
    populateTagSets,
    populateTags,
    updateLibrary,
  } = mutations

  describe('selectPlate', () => {
    it('selects a plate by default', () => {
      // mock state
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        selected: {
          ...defaultStateObject.selected,
          plates: {
            _2: { id: '2', selected: true },
          },
        },
      }
      // apply mutation
      selectPlate(state, { id: '1' })
      // assert result
      // We expect the plate to be recorded in the selected plates it should:
      // - Prefix the key with an _ to maintain insert order
      // - Not disrupt other plates in the store
      expect(state.selected.plates).toEqual({
        _2: { id: '2', selected: true },
        _1: { id: '1', selected: true },
      })
    })
  })

  describe('selectTagSet', () => {
    it('updates the state', () => {
      const tagSets = {
        '1': {
          'id:': '1',
          name: 'tagSet1',
          tags: ['1', '2'],
        },
        '2': {
          'id:': '2',
          name: 'tagSet2',
        },
      }

      const tags = {
        '1': {
          id: '1',
          name: 'tag1',
        },
        '2': {
          id: '2',
          name: 'tag2',
        },
        '3': {
          id: '3',
          name: 'tag3',
        },
        '4': {
          id: '4',
          name: 'tag4',
        },
      }
      // mock state
      const state = defaultState()
      state.resources.tagSets = tagSets
      state.resources.tags = tags
      // apply mutation
      selectTagSet(state, { id: '1' })
      // assert result
      expect(state.selected.tagSet).toEqual({ id: '1' })
    })
  })
  describe('selectRequest', () => {
    it('sets a library with the selected request by default', () => {
      // mock state
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        libraries: {
          _2: {
            pacbio_request_id: '2',
            tag_id: null,
            volume: null,
            concentration: null,
            fragment_size: null,
            template_prep_kit_box_barcode: null,
          },
        },
      }
      // apply mutation
      selectRequest(state, { id: '1' })
      // We expect the request to be recorded in the selected requests it should:
      // - Prefix the key with an _ to maintain insert order
      // - Not disrupt other requests in the store
      expect(state.libraries).toEqual({
        _2: {
          pacbio_request_id: '2',
          tag_id: null,
          volume: null,
          concentration: null,
          fragment_size: null,
          template_prep_kit_box_barcode: null,
        },
        _1: {
          pacbio_request_id: '1',
          tag_id: null,
          volume: null,
          concentration: null,
          fragment_size: null,
          template_prep_kit_box_barcode: null,
        },
      })
    })

    it('can deselect a request', () => {
      // mock state
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        libraries: {
          _2: {
            pacbio_request_id: '2',
            tag_id: null,
            volume: null,
            concentration: null,
            fragment_size: null,
          },
          _1: {
            pacbio_request_id: '1',
            tag_id: null,
            volume: null,
            concentration: null,
            fragment_size: null,
          },
        },
      }
      // apply mutation
      selectRequest(state, { id: '1', selected: false })
      // We expect the request to be recorded in the selected requests it should:
      // - Prefix the key with an _ to maintain insert order
      // - Not disrupt other requests in the store
      expect(state.libraries).toEqual({
        _2: {
          pacbio_request_id: '2',
          tag_id: null,
          volume: null,
          concentration: null,
          fragment_size: null,
        },
      })
    })
  })

  describe('populatePlates', () => {
    it('updates the state', () => {
      // mock state
      const plates = Data.PacbioPlatesRequest.data.data
      const state = defaultState()
      // apply mutation
      populatePlates(state, plates)
      // assert result
      expect(state.resources.plates).toEqual(
        dataToObjectById({ data: plates, includeRelationships: true }),
      )
    })
  })

  describe('populateWells', () => {
    it('updates the state', () => {
      // mock state
      const wells = Data.PacbioPlatesRequest.data.included.slice(0, 4)
      const state = defaultState()
      // apply mutation
      populateWells(state, wells)
      // assert result
      expect(state.resources.wells).toEqual(
        dataToObjectById({ data: wells, includeRelationships: true }),
      )
    })
  })

  describe('populateRequests', () => {
    it('updates the state', () => {
      // mock state
      const requests = Data.PacbioPlatesRequest.data.included.slice(4, 8)

      const state = defaultState()
      // apply mutation
      populateRequests(state, requests)
      // assert result
      expect(state.resources.requests).toEqual(
        dataToObjectById({ data: requests, includeRelationships: false }),
      )
    })
  })

  describe('populateTagSets', () => {
    it('updates the state', () => {
      // mock state
      const tagSets = Data.PacbioTagSets.data.data
      const state = defaultState()
      // apply mutation
      populateTagSets(state, tagSets)
      // assert result
      expect(state.resources.tagSets).toEqual(
        dataToObjectById({ data: tagSets, includeRelationships: true }),
      )
    })
  })

  describe('populateTags', () => {
    it('updates the state', () => {
      // mock state
      const tags = Data.PacbioTagSets.data.included
      const state = defaultState()
      // apply mutation
      populateTags(state, tags)
      // assert result
      expect(state.resources.tags).toEqual(
        dataToObjectById({ data: tags, includeRelationships: false }),
      )
    })
  })

  describe('updateLibrary', () => {
    const libraries = {
      _1: {
        pacbio_request_id: '1',
      },
      _2: {
        pacbio_request_id: '2',
        tag_id: '1',
        template_prep_kit_box_barcode: 'ABC1',
        volume: 1,
        concentration: 1,
        fragment_size: 100,
      },
    }

    it('single attribute', () => {
      const state = defaultState()
      state.libraries = { ...libraries }
      updateLibrary(state, { id: '_1', attributes: { template_prep_kit_box_barcode: 'BCD2' } })
      const library = state.libraries['_1']
      expect(library.template_prep_kit_box_barcode).toEqual('BCD2')
    })

    it('multiple attributes', () => {
      const attributes = { template_prep_kit_box_barcode: 'BCD2', volume: 10, concentration: 5 }
      const state = defaultState()
      state.libraries = { ...libraries }
      updateLibrary(state, { id: '_1', attributes })
      expect(state.libraries['_1']).toEqual({ ...state.libraries['_1'], ...attributes })
    })

    it('existing attributes', () => {
      const attributes = { template_prep_kit_box_barcode: 'EFG3', fragment_size: 10 }
      const state = defaultState()
      state.libraries = { ...libraries }
      updateLibrary(state, { id: '_2', attributes })
      expect(state.libraries['_2']).toEqual({ ...state.libraries['_2'], ...attributes })
    })

    it('fails silently if library does not exist', () => {
      const state = defaultState()
      state.libraries = { ...libraries }
      updateLibrary(state, { id: '_3', attributes: { pacbio_request_id: 10 } })
      expect(state.libraries).toEqual(libraries)
    })
  })
})
