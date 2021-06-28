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
      const tagSets = {
        "1": {
          "id:" : "1",
          "name": "tagSet1",
          "uuid": "uuid1",
          "pipeline": "pipeline1"
        },
        '2': {
          "id:" : "2",
          "name": "tagSet2",
          "uuid": "uuid2",
          "pipeline": "pipeline1"
        },
      }
      state.resources.tagSets = tagSets
      expect(tagSetList(state)).toEqual(Object.values(tagSets))
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
