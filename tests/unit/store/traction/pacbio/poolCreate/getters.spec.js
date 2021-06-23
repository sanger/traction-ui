import getters from "@/store/traction/pacbio/poolCreate/getters"
import defaultState from "@/store/traction/pacbio/poolCreate/state"

describe("getters.js", () => {
  const state = defaultState()
  const {
    labwareList,
    tagSetList,
    selectedTagSet,
    selectedPlates,
    selectedRequests,
  } = getters;

  describe('labwareList', () => {
    it('returns what it does', () => {
      expect(labwareList(state)).toEqual(undefined)
    })
  })

  describe('tagSetList', () => {
    it('returns what it does', () => {
      expect(tagSetList(state)).toEqual(undefined)
    })
  })

  describe('selectedTagSet', () => {
    it('returns what it does', () => {
      expect(selectedTagSet(state)).toEqual(undefined)
    })
  })

  describe('selectedPlates', () => {
    it('returns what it does', () => {
      expect(selectedPlates(state)).toEqual(undefined)
    })
  })

  describe('selectedRequests', () => {
    it('returns what it does', () => {
      expect(selectedRequests(state)).toEqual(undefined)
    })
  })


})
