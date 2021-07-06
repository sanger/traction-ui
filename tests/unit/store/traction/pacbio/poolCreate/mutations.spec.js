import mutations from '@/store/traction/pacbio/poolCreate/mutations'
import defaultState from '@/store/traction/pacbio/poolCreate/state'
import { Data } from 'testHelper'
import { dataToObjectById } from '@/api/JsonApi'

describe('mutations.js', () => {
  const {
    selectPlate,
    selectPlates,
    selectTagSet,
    selectRequest,
    populatePlates,
    populateWells,
    populateRequests,
    populateTagSets,
    populateTags,
  } = mutations

  describe('selectPlate', () => {
    it('updates the state', () => {
      // mock state
      const state = defaultState()
      // apply mutation
      selectPlate(state, {})
      // assert result
      //expect(state, value).toEqual(new_value)
    })
  })

  describe('selectPlates', () => {
    it('updates the state', () => {
      // mock state
      const state = defaultState()
      // apply mutation
      selectPlates(state, {})
      // assert result
      //expect(state, value).toEqual(new_value)
    })
  })

  describe('selectTagSet', () => {
    it('updates the state', () => {
      const tagSets = {
        '1': {
          'id:': '1',
          name: 'tagSet1',
        },
        '2': {
          'id:': '2',
          name: 'tagSet2',
        },
      }
      // mock state
      const state = defaultState()
      state.resources.tagSets = tagSets
      // apply mutation
      selectTagSet(state, { id: '1' })
      // assert result
      // expect(state, value).toEqual(new_value)
      expect(state.selected.tagSet).toEqual(tagSets['1'])
    })
  })
  describe('selectRequest', () => {
    it('sets a request as selected by default', () => {
      // mock state
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        selected: {
          ...defaultStateObject.selected,
          requests: {
            _2: { id: '2', selected: true },
          },
        },
      }
      // apply mutation
      selectRequest(state, { id: '1' })
      // We expect the request to be recorded in the selected requests it should:
      // - Prefix the key with an _ to maintain insert order
      // - Not disrupt other requests in the store
      expect(state.selected.requests).toEqual({
        _2: { id: '2', selected: true },
        _1: { id: '1', selected: true },
      })
    })

    it('can deselect a request', () => {
      // mock state
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        selected: {
          ...defaultStateObject.selected,
          requests: {
            _2: { id: '2', selected: true },
            _1: { id: '1', selected: true },
          },
        },
      }
      // apply mutation
      selectRequest(state, { id: '1', selected: false })
      // We expect the request to be recorded in the selected requests it should:
      // - Prefix the key with an _ to maintain insert order
      // - Not disrupt other equests in the store
      expect(state.selected.requests).toEqual({
        _2: { id: '2', selected: true },
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
})
