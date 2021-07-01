import getters from '@/store/traction/pacbio/poolCreate/getters'
import defaultState from '@/store/traction/pacbio/poolCreate/state'

describe('getters.js', () => {
  const state = defaultState()
  const { labwareList, tagSetList, selectedTagSet, selectedPlates, selectedRequests, tagList, plateWells, wellRequest } = getters

  describe('labwareList', () => {
    it('returns what it does', () => {
      const plates = {
        '1': {
          barcode: 'DN1',
          id: '1',
          type: 'plates',
          wells: []
        },
        '2': {
          barcode: 'DN2',
          id: '2',
          type: 'plates',
          wells: []
        }
      }
      state.resources.plates = plates
      expect(labwareList(state)).toEqual(Object.values(plates))
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
      const plates = {
        '1': {
          barcode: 'DN1',
          id: '1',
          type: 'plates',
          wells: []
        },
      }
      state.selected.plates = plates
      expect(selectedPlates(state)).toEqual(Object.values(plates))
    })
  })

  describe('selectedRequests', () => {
    it('returns what it does', () => {
      expect(selectedRequests(state)).toEqual(undefined)
    })
  })

  describe('plateWells', () => {
    const wells = {
      '1': {
        position: "A1",
        id: "1",
        type: "wells"
      }
    }
    
    const plates = {
      '1': {
        barcode: 'DN1',
        id: '1',
        type: 'plates',
        wells: [ "1" ]
      },
    }

    it('returns all wells associated in plate', () => {
      state.resources.plates = plates
      state.resources.wells = wells
      expect(plateWells(state)('1')).toEqual([wells[1]])
    })
  })

  describe('wellRequest', () => {
    const wells = {
      '1': {
        position: "A1",
        id: "1",
        requests: ["1"],
        type: "wells"
      },
      '2': {
        position: "A2",
        id: "2",
        type: "wells"
      }
    }
    
    const requests = {
      '1': {
        sample_name: "Sample1",
        cost_code: "12345",
        source_identifier: "DN1:A1",
        external_study_id: "1",
        id: "1",
        type: "requests"
      }
    }

    it('returns the request associated with the well', () => {
      state.resources.wells = wells
      state.resources.requests = requests
      expect(wellRequest(state)('1')).toEqual(requests[1])
    })

    it('returns nothing if no requests are associated with the well', () => {
      state.resources.wells = wells
      state.resources.requests = requests
      expect(wellRequest(state)('2')).toEqual()
    })
  })

})
