import getters from '@/store/traction/pacbio/poolCreate/getters'
import defaultState from '@/store/traction/pacbio/poolCreate/state'

describe('getters.js', () => {
  const state = defaultState()
  const { labwareList, tagSetList, selectedTagSet, selectedPlates, selectedRequests, tagList } = getters

  describe('labwareList', () => {
    it('returns what it does', () => {
      expect(labwareList(state)).toEqual(undefined)
    })
  })

  describe('tagSetList', () => {
    it('returns what it does', () => {
      const tagSets = {
        '1': {
          'id:': '1',
          name: 'tagSet1',
          uuid: 'uuid1',
          pipeline: 'pipeline1',
        },
        '2': {
          'id:': '2',
          name: 'tagSet2',
          uuid: 'uuid2',
          pipeline: 'pipeline1',
        },
      }
      state.resources.tagSets = tagSets
      expect(tagSetList(state)).toEqual(Object.values(tagSets))
    })
  })

  describe('tagList', () => {

    const tags = {
      "1": { "id": "1", "name": "tag1"},
      "2": { "id": "2", "name": "tag2"},
      "3": { "id": "3", "name": "tag3"},
      "4": { "id": "4", "name": "tag4"},
      "5": { "id": "5", "name": "tag5"},
    }

    it('returns what it does', () => {
      state.resources.tags = tags
      expect(tagList(state)()).toEqual(tags.values)
    })

    it('when ids are included', () => {
      state.resources.tags = tags
      const ids = ["1","2","3"]
      expect(tagList(state)(ids).length).toEqual(ids.length)
    })
  })

  describe('selectedTagSet', () => {
    it('returns what it does', () => {
      const tagSet = { id: "1", name: "TagSet1"}
      state.selected.tagSet = tagSet
      expect(selectedTagSet(state)).toEqual(tagSet)
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
