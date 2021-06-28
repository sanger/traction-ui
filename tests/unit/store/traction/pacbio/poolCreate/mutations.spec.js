import mutations from '@/store/traction/pacbio/poolCreate/mutations'
import defaultState from "@/store/traction/pacbio/poolCreate/state"
import { Data } from '../../../../testHelper'
import { dataToObjectById } from '@/api/JsonApi'

describe('mutations.js', () => {
  const {
    selectPlate,
    selectPlates,
    selectTagSet,
    selectRequest,
    selectRequests,
    populatePlates,
    populateWells,
    populateRequests,
    populateTagSets,
    populateTags,
  } = mutations

  describe("selectPlate", () => {
    it('updates the state', () => {
        // mock state
        const state = defaultState()
        // apply mutation
        selectPlate(state, {})
        // assert result
        //expect(state, value).toEqual(new_value)
    })
  })

  describe("selectPlates", () => {
    it('updates the state', () => {
        // mock state
        const state = defaultState()
        // apply mutation
        selectPlates(state, {})
        // assert result
        //expect(state, value).toEqual(new_value)
    })
  })

  describe("selectTagSet", () => {
    it('updates the state', () => {
        // mock state
        const state = defaultState()
        // apply mutation
        selectTagSet(state, {})
        // assert result
        // expect(state, value).toEqual(new_value)
    })
  })
  describe("selectRequest", () => {
    it('updates the state', () => {
        // mock state
        const state = defaultState()
        // apply mutation
        selectRequest(state, {})
        // assert result
        // expect(state, value).toEqual(new_value)
    })
  })

  describe("selectRequests", () => {
    it('updates the state', () => {
        // mock state
        const state = defaultState()
        // apply mutation
        selectRequests(state, {})
        // assert result
        // expect(state, value).toEqual(new_value)
    })
  })

  describe("populatePlates", () => {
    it('updates the state', () => {
        // mock state
        const state = defaultState()
        // apply mutation
        populatePlates(state, {})
        // assert result
        // expect(state, value).toEqual(new_value)
    })
  })

  describe("populateWells", () => {
    it('updates the state', () => {
        // mock state
        const state = defaultState()
        // apply mutation
        populateWells(state, {})
        // assert result
        // expect(state, value).toEqual(new_value)
    })
  })

  describe("populateRequests", () => {
    it('updates the state', () => {
        // mock state
        const state = defaultState()
        // apply mutation
        populateRequests(state, {})
        // assert result
        // expect(state, value).toEqual(new_value)
    })
  })

  describe("populateTagSets", () => {
    it('updates the state', () => {
        // mock state
        const tagSets = Data.PacbioTagSets.data.data
        const state = defaultState()
        // apply mutation
        populateTagSets(state, tagSets)
        // assert result
        expect(state.resources.tagSets).toEqual(dataToObjectById(tagSets))
    })
  })

  describe("populateTags", () => {
    it('updates the state', () => {
        // mock state
        const state = defaultState()
        // apply mutation
        populateTags(state, {})
        // assert result
        // expect(state, value).toEqual(new_value)
    })
  })
})
