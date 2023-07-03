import getters from '@/store/traction/pacbio/poolCreate/getters'
import defaultState from '@/store/traction/pacbio/poolCreate/state'
import { Data } from '@support/testHelper'
import { dataToObjectById, groupIncludedByResource } from '@/api/JsonApi'

describe('getters.js', () => {
  const state = defaultState()
  const {
    plateList,
    tubeList,
    tagSetList,
    selectedTagSet,
    selectedPlates,
    selectedRequests,
    tagList,
    wellList,
    requestList,
    libraryItem,
    poolItem,
    tubeItem,
  } = getters

  const tagSets = {
    1: {
      id: '1',
      name: 'tagSet1',
      uuid: 'uuid1',
      pipeline: 'pipeline1',
      tags: [],
    },
    2: {
      id: '2',
      name: 'tagSet2',
      uuid: 'uuid2',
      pipeline: 'pipeline1',
      tags: [],
    },
  }

  describe('plateList', () => {
    it('returns a list of labware resources', () => {
      const plates = {
        1: {
          barcode: 'DN1',
          id: '1',
          type: 'plates',
          wells: {},
        },
        2: {
          barcode: 'DN2',
          id: '2',
          type: 'plates',
          wells: {},
        },
      }
      const expected = [
        {
          barcode: 'DN1',
          id: '1',
          type: 'plates',
          wells: {},
          selected: true,
        },
        {
          barcode: 'DN2',
          id: '2',
          type: 'plates',
          wells: {},
        },
      ]
      state.resources.plates = plates
      state.selected.plates = { 1: { id: '1', selected: true } }
      expect(plateList(state)).toEqual(expected)
    })
  })

  describe('tubeList', () => {
    it('returns a list of labware resources', () => {
      const tubes = {
        1: {
          barcode: 'NT1',
          id: '1',
          type: 'tubes',
          wells: [],
        },
        2: {
          barcode: 'NT2',
          id: '2',
          type: 'tubes',
          wells: [],
        },
      }
      const expected = [
        {
          barcode: 'NT1',
          id: '1',
          type: 'tubes',
          wells: [],
          selected: true,
        },
        {
          barcode: 'NT2',
          id: '2',
          type: 'tubes',
          wells: [],
        },
      ]
      state.resources.tubes = tubes
      state.selected.tubes = { 1: { id: '1', selected: true } }
      expect(tubeList(state)).toEqual(expected)
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
      1: { id: '1', name: 'tag1' },
      2: { id: '2', name: 'tag2' },
      3: { id: '3', name: 'tag3' },
      4: { id: '4', name: 'tag4' },
      5: { id: '5', name: 'tag5' },
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
        1: {
          barcode: 'DN1',
          id: '1',
          type: 'plates',
          wells: {},
        },
      }
      state.selected.plates = plates
      expect(selectedPlates(state)).toEqual(Object.values(plates))
    })
  })

  describe('selectedRequests', () => {
    const payload = Data.PacbioRequestsRequest.data
    const defaultStateObject = defaultState()
    const requestResources = payload.data
    const { wells: wellResources, tubes: tubeResources } = groupIncludedByResource(payload.included)
    const requests = dataToObjectById({ data: requestResources, includeRelationships: true })
    const wells = dataToObjectById({ data: wellResources, includeRelationships: true })
    const tubes = dataToObjectById({ data: tubeResources, includeRelationships: true })

    // When selecting a request with append the id with an underscore. This ensures
    // keys are maintained in insertion order, not numeric order. This allow our requests
    // to maintain the order in which they were selected
    const libraries = {
      _136: {
        pacbio_request_id: '136',
        tag_id: null,
        volume: null,
        concentration: null,
        insert_size: null,
      }, // A selected request
      _3: {
        pacbio_request_id: '3',
        tag_id: null,
        volume: null,
        concentration: null,
        insert_size: null,
      }, // A selected request
      _40: {
        pacbio_request_id: '40',
        tag_id: null,
        volume: null,
        concentration: null,
        insert_size: null,
      }, // A selected request
    }

    const state = {
      ...defaultStateObject,
      resources: { ...defaultStateObject.resources, requests, wells, tubes },
      libraries,
    }

    it('returns an array of request resources that have been selected', () => {
      expect(selectedRequests(state)).toEqual([
        { ...requests['40'], selected: true },
        { ...requests['136'], selected: true },
        { ...requests['3'], selected: true },
      ])
    })
  })

  describe('wellList', () => {
    const wells = {
      1: { id: '1', position: 'A1' },
      2: { id: '2', position: 'B1' },
      3: { id: '3', position: 'C1' },
      4: { id: '4', position: 'D1' },
      5: { id: '5', position: 'E1' },
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
      1: { id: '1', name: 'request1' },
      2: { id: '2', name: 'request2' },
      3: { id: '3', name: 'request3' },
      4: { id: '4', name: 'request4' },
      5: { id: '5', name: 'request5' },
    }
    const libraries = {
      _3: {
        pacbio_request_id: '3',
        tag_id: null,
        volume: null,
        concentration: null,
        insert_size: null,
      },
      _4: {
        pacbio_request_id: '4',
        tag_id: null,
        volume: null,
        concentration: null,
        insert_size: null,
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
        tag_id: null,
        volume: null,
        concentration: null,
        insert_size: null,
      },
      _4: {
        pacbio_request_id: '4',
        tag_id: null,
        volume: null,
        concentration: null,
        insert_size: null,
      },
    }
    it('will return the correct library', () => {
      state.libraries = libraries
      expect(libraryItem(state)('3')).toEqual(libraries['_3'])
    })
  })

  describe('poolItem', () => {
    const pool = {
      id: 1,
      template_prep_kit_box_barcode: 'ABC1',
      volume: '1',
      concentration: '1',
      insert_size: '100',
    }

    it('returns the correct data', () => {
      state.pool = pool
      expect(poolItem(state)).toEqual(pool)
    })

    it('when the pool does not exist', () => {
      state.pool = undefined
      expect(poolItem(state)).toEqual({})
    })
  })

  describe('tubeItem', () => {
    const tube = {
      id: 1,
      barcode: 'TRAC-1',
    }

    it('returns the correct data', () => {
      state.tube = tube
      expect(tubeItem(state)).toEqual(tube)
    })

    it('when the tube does not exist', () => {
      state.tube = undefined
      expect(tubeItem(state)).toEqual({})
    })
  })
})
