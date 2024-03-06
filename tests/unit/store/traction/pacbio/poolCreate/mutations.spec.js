import mutations from '@/store/traction/pacbio/poolCreate/mutations'
import defaultState from '@/store/traction/pacbio/poolCreate/state'
import { Data } from '@support/testHelper'
import { dataToObjectById } from '@/api/JsonApi'

describe('mutations.js', () => {
  const {
    selectPlate,
    selectTube,
    selectTagSet,
    selectRequest,
    populatePlates,
    populateTubes,
    populateWells,
    populateRequests,
    populateTagSets,
    populateTags,
    populateLibraries,
    populatePoolAttributes,
    populatePoolTube,
    updateLibrary,
    clearPoolData,
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
            2: { id: '2', selected: true },
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
        1: { id: '1', selected: true },
        2: { id: '2', selected: true },
      })
    })
  })

  describe('selectTube', () => {
    it('selects a tube by default', () => {
      // mock state
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        selected: {
          ...defaultStateObject.selected,
          tubes: {
            2: { id: '2', selected: true },
          },
        },
      }
      // apply mutation
      selectTube(state, { id: '1' })
      // assert result
      // We expect the tube to be recorded in the selected tubes it should:
      // - Prefix the key with an _ to maintain insert order
      // - Not disrupt other tubes in the store
      expect(state.selected.tubes).toEqual({
        1: { id: '1', selected: true },
        2: { id: '2', selected: true },
      })
    })
  })

  describe('selectTagSet', () => {
    it('updates the state', () => {
      const tagSets = {
        1: {
          'id:': '1',
          name: 'tagSet1',
          tags: ['1', '2'],
        },
        2: {
          'id:': '2',
          name: 'tagSet2',
        },
      }

      const tags = {
        1: {
          id: '1',
          name: 'tag1',
        },
        2: {
          id: '2',
          name: 'tag2',
        },
        3: {
          id: '3',
          name: 'tag3',
        },
        4: {
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
            insert_size: null,
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
          insert_size: null,
          template_prep_kit_box_barcode: null,
        },
        _1: {
          pacbio_request_id: '1',
          tag_id: null,
          volume: null,
          concentration: null,
          insert_size: null,
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
            insert_size: null,
          },
          _1: {
            pacbio_request_id: '1',
            tag_id: null,
            volume: null,
            concentration: null,
            insert_size: null,
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
          insert_size: null,
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

  describe('populateTubes', () => {
    it('updates the state', () => {
      // mock state
      const tubes = Data.TractionTubesWithPacbioPools.data.data
      const state = defaultState()
      // apply mutation
      populateTubes(state, tubes)
      // assert result
      expect(state.resources.tubes).toEqual(
        dataToObjectById({ data: tubes, includeRelationships: true }),
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

      const initialState = defaultState()
      const state = {
        ...initialState,
        resources: {
          ...initialState.resources,
          requests: {
            1: {},
            136: {},
          },
        },
      }
      // apply mutation
      populateRequests(state, requests)
      // assert result
      expect(state.resources.requests).toEqual({
        1: {},
        ...dataToObjectById({ data: requests, includeRelationships: true }),
      })
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

  describe('populateLibraries', () => {
    it('sets a library with the correct data', () => {
      // mock state
      const state = defaultState()
      // apply mutation
      populateLibraries(state, Data.TractionPacbioPoolV1.data.included.slice(0, 1))
      // We expect the request to be recorded in the selected requests it should:
      // - Prefix the key with an _ to maintain insert order
      // - Not disrupt other requests in the store
      expect(state.libraries).toEqual({
        _4: expect.objectContaining({
          id: '242',
          pacbio_request_id: '4',
          tag_id: '3',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '2424',
          insert_size: 1,
        }),
      })
    })
  })

  describe('populatePoolAttributes', () => {
    it('sets the pool with the correct data', () => {
      const state = defaultState()
      // apply mutation
      populatePoolAttributes(state, Data.TractionPacbioPoolV1.data.data)
      expect(state.pool).toEqual(
        expect.objectContaining({
          id: '242',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '2424',
          insert_size: 1,
          source_identifier: 'DN1:A4',
        }),
      )
    })
  })

  describe('populatePoolTube', () => {
    it('sets the tube with the correct data', () => {
      const tube = { id: 1, attributes: { barcode: 'TRAC-1' } }
      const state = defaultState()
      //apply mutation
      populatePoolTube(state, tube)
      expect(state.tube).toEqual({
        id: 1,
        barcode: 'TRAC-1',
      })
    })
  })

  describe('updateLibrary', () => {
    it('sets a library with the correct data', () => {
      // mock state
      const state = defaultState()
      // Prepopulate with some dummy data
      populateLibraries(state, Data.TractionPacbioPoolV1.data.included.slice(0, 1))
      // apply mutation
      updateLibrary(state, { pacbio_request_id: '4', insert_size: 4 })
      // We expect the request to be recorded in the selected requests it should:
      // - Prefix the key with an _ to maintain insert order
      // - Not disrupt other requests in the store
      expect(state.libraries).toEqual({
        _4: expect.objectContaining({
          id: '242',
          pacbio_request_id: '4',
          tag_id: '3',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '2424',
          insert_size: 4,
        }),
      })
    })
  })

  describe('clearPoolData', () => {
    it('clears existing pool data', () => {
      const state = defaultState()
      // populates an existing pool into state
      populatePoolAttributes(state, Data.TractionPacbioPoolV1.data.data)
      clearPoolData(state)
      expect(state.selected).toEqual({
        tagSet: {},
        plates: {},
        tubes: {},
      })
      expect(state.libraries).toEqual({})
      expect(state.pool).toEqual({})
      expect(state.tube).toEqual({})
    })
  })
})
