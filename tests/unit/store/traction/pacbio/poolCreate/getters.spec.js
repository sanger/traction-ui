import getters from '@/store/traction/pacbio/poolCreate/getters'
import defaultState from '@/store/traction/pacbio/poolCreate/state'

describe('getters.js', () => {
  const state = defaultState()
  const {
    labwareList,
    tagSetList,
    selectedTagSet,
    selectedPlates,
    selectedRequests,
    tagList,
    wellList,
    requestList,
  } = getters

  describe('labwareList', () => {
    it('returns what it does', () => {
      const plates = {
        '1': {
          barcode: 'DN1',
          id: '1',
          type: 'plates',
          wells: [],
        },
        '2': {
          barcode: 'DN2',
          id: '2',
          type: 'plates',
          wells: [],
        },
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
      '1': { id: '1', name: 'tag1' },
      '2': { id: '2', name: 'tag2' },
      '3': { id: '3', name: 'tag3' },
      '4': { id: '4', name: 'tag4' },
      '5': { id: '5', name: 'tag5' },
    }

    it('returns what it does', () => {
      state.resources.tags = tags
      expect(tagList(state)()).toEqual(tags.values)
    })

    it('when ids are included', () => {
      state.resources.tags = tags
      const ids = ['1', '2', '3']
      expect(tagList(state)(ids).length).toEqual(ids.length)
    })
  })

  describe('selectedTagSet', () => {
    it('returns what it does', () => {
      const tagSet = { id: '1', name: 'TagSet1' }
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
          wells: [],
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

  describe('wellList', () => {
    const wells = {
      '1': { id: '1', position: 'A1' },
      '2': { id: '2', position: 'B1' },
      '3': { id: '3', position: 'C1' },
      '4': { id: '4', position: 'D1' },
      '5': { id: '5', position: 'E1' },
    }

    it('returns what it does', () => {
      state.resources.wells = wells
      expect(wellList(state)()).toEqual(wells.values)
    })

    it('when ids are included', () => {
      state.resources.wells = wells
      const ids = ['1', '2', '3']
      expect(wellList(state)(ids).length).toEqual(ids.length)
    })
  })

  describe('requestList', () => {
    const requests = {
      '1': { id: '1', name: 'request1' },
      '2': { id: '2', name: 'request2' },
      '3': { id: '3', name: 'request3' },
      '4': { id: '4', name: 'request4' },
      '5': { id: '5', name: 'request5' },
    }

    it('returns what it does', () => {
      state.resources.requests = requests
      expect(requestList(state)()).toEqual(requests.values)
    })

    it('when ids are included', () => {
      state.resources.requests = requests
      const ids = ['1', '2', '3']
      expect(requestList(state)(ids).length).toEqual(ids.length)
    })
  })
})
