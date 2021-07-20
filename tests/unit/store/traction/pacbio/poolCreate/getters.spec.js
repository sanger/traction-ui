import getters from '@/store/traction/pacbio/poolCreate/getters'
import defaultState from '@/store/traction/pacbio/poolCreate/state'
import { Data } from 'testHelper'
import { dataToObjectById } from '@/api/JsonApi'

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
    libraryItem,
    result,
  } = getters

  const tagSets = {
    '1': {
      id: '1',
      name: 'tagSet1',
      uuid: 'uuid1',
      pipeline: 'pipeline1',
      tags: [],
    },
    '2': {
      id: '2',
      name: 'tagSet2',
      uuid: 'uuid2',
      pipeline: 'pipeline1',
      tags: [],
    },
  }

  describe('labwareList', () => {
    it('returns a list of labware resources', () => {
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
      const expected = [
        {
          barcode: 'DN1',
          id: '1',
          type: 'plates',
          wells: [],
          selected: true,
        },
        {
          barcode: 'DN2',
          id: '2',
          type: 'plates',
          wells: [],
        },
      ]
      state.resources.plates = plates
      state.selected.plates = { _1: { id: '1', selected: true } }
      expect(labwareList(state)).toEqual(expected)
    })
  })

  describe('tagSetList', () => {
    it('returns what it does', () => {
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
    it('returns the selected tag set', () => {
      const tagSet = { id: '1' }
      state.selected.tagSet = tagSet
      state.resources.tagSets = tagSets
      expect(selectedTagSet(state)).toEqual(tagSets['1'])
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
    const defaultStateObject = defaultState()
    const requestResources = Data.PacbioPlatesRequest.data.included.slice(4, 8)
    const requests = dataToObjectById({ data: requestResources, includeRelationships: false })

    // When selecting a request with append the id with an underscore. This ensures
    // keys are maintained in insertion order, not numeric order. This allow our requests
    // to maintain the order in which they were selected
    const libraries = {
      _136: {
        pacbio_request_id: '136',
        tagId: null,
        volume: null,
        concentration: null,
        fragmentSize: null,
      }, // A selected request
      _40: {
        pacbio_request_id: '40',
        tagId: null,
        volume: null,
        concentration: null,
        fragmentSize: null,
      }, // A selected request
    }

    const state = {
      ...defaultStateObject,
      resources: { ...defaultStateObject.resources, requests },
      libraries,
    }

    it('returns an array of request resources that have been selected', () => {
      expect(selectedRequests(state)).toEqual([
        { ...requests['136'], selected: true },
        { ...requests['40'], selected: true },
      ])
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
    const libraries = {
      _3: {
        pacbio_request_id: '3',
        tagId: null,
        volume: null,
        concentration: null,
        fragmentSize: null,
      },
      _4: {
        pacbio_request_id: '4',
        tagId: null,
        volume: null,
        concentration: null,
        fragmentSize: null,
      },
    }
    const mergedRequests = [
      { id: '1', name: 'request1', selected: false },
      { id: '2', name: 'request2', selected: false },
      { id: '3', name: 'request3', selected: true },
      { id: '4', name: 'request4', selected: true },
      { id: '5', name: 'request5', selected: false },
    ]

    it('returns what it does', () => {
      state.resources.requests = requests
      state.libraries = libraries
      expect(requestList(state)()).toEqual(mergedRequests)
    })

    it('when ids are included', () => {
      state.resources.requests = requests
      state.libraries = libraries
      const ids = ['1', '2', '3']
      expect(requestList(state)(ids).length).toEqual(ids.length)
    })
  })

  describe('libraryItem', () => {
    const libraries = {
      _3: {
        pacbio_request_id: '3',
        tagId: null,
        volume: null,
        concentration: null,
        fragmentSize: null,
      },
      _4: {
        pacbio_request_id: '4',
        tagId: null,
        volume: null,
        concentration: null,
        fragmentSize: null,
      },
    }
    it('will return the correct library', () => {
      state.libraries = libraries
      expect(libraryItem(state)('3')).toEqual(libraries['_3'])
    })
  })

  describe('resultItem', () => {
    it('returns what it does', () => {
      const newResult = { state: 'success', message: 'help' }
      state.result = newResult
      expect(result(state)).toEqual(newResult)
    })
  })
})
