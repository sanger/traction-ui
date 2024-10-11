import getters from '@/store/traction/ont/pools/getters'
import defaultState from '@/store/traction/ont/pools/state'
import merge from 'lodash-es/merge'
import { describe, expect, it } from 'vitest'
// import { Data } from '@support/testHelper'
import { dataToObjectById, groupIncludedByResource } from '@/api/JsonApi'
import OntRequestFactory from '@tests/factories/OntRequestFactory.js'
import OntPlateFactory from '@tests/factories/OntPlateFactory.js'
import OntPoolFactory from '@tests/factories/OntPoolFactory.js'

const ontRequestFactory = OntRequestFactory()
const ontPlateFactory = OntPlateFactory()
const ontPoolFactory = OntPoolFactory()

describe('getters.js', () => {
  const state = merge(defaultState(), {
    resources: {
      requests: ontRequestFactory.storeData,
    },
  })
  const {
    poolItem,
    tubeItem,
    libraryItem,
    selectedPlates,
    selectedTubes,
    wellList,
    requestList,
    tagSetList,
    tagList,
    selectedTagSet,
    selectedRequests,
    pools,
  } = getters

  const tagSets = {
    1: {
      id: '1',
      name: 'tagSet1',
      pipeline: 'pipeline1',
      tags: [],
    },
    2: {
      id: '2',
      name: 'tagSet2',
      pipeline: 'pipeline1',
      tags: [],
    },
  }

  describe('requests', () => {
    it('returns a list of requests', () => {
      expect(getters.requests(state)).toEqual(Object.values(ontRequestFactory.storeData))
    })
  })

  describe('poolItem', () => {
    const pool = {
      id: 1,
      volume: '1',
      kit_barcode: 'ABC1',
      concentration: '1',
      insert_size: '100',
    }

    it('returns the correct data', () => {
      state.pooling.pool = pool
      expect(poolItem(state)).toEqual(pool)
    })

    it('when the pool does not exist', () => {
      state.pooling.pool = undefined
      expect(poolItem(state)).toEqual({})
    })
  })

  describe('tubeItem', () => {
    const tube = {
      id: 1,
      barcode: 'GEN-1668092750-4',
    }
    it('returns the tube data', () => {
      state.pooling.tube = tube
      expect(tubeItem(state)).toEqual(tube)
    })

    it('when the tube does not exist', () => {
      state.pooling.tube = undefined
      expect(tubeItem(state)).toEqual({})
    })
  })

  describe('libraryItem', () => {
    // When selecting a request with append the id with an underscore. This ensures
    // keys are maintained in insertion order, not numeric order. This allow our requests
    // to maintain the order in which they were selected
    const libraries = {
      3: {
        ont_request_id: '3',
        tag_id: null,
        volume: null,
        concentration: null,
        insert_size: null,
      },
      4: {
        ont_request_id: '4',
        tag_id: null,
        volume: null,
        concentration: null,
        insert_size: null,
      },
    }

    it('returns a library', () => {
      state.pooling.libraries = libraries
      expect(libraryItem(state)('3')).toEqual(libraries['3'])
    })
  })

  describe('selectedPlates', () => {
    it('returns a list of the selected plates', () => {
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

  describe('selectedTubes', () => {
    it('returns the list of the selected tubes', () => {
      const tubes = {
        1: {
          barcode: 'DN1',
          id: '1',
          type: 'tube',
        },
      }
      state.selected.tubes = tubes
      expect(selectedTubes(state)).toEqual(Object.values(tubes))
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
    it('returns a list of all fetched wells', () => {
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
      3: {
        ont_request_id: '3',
        tag_id: null,
        volume: null,
        concentration: null,
        insert_size: null,
      },
      4: {
        ont_request_id: '4',
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

    it('returns a list of all fetched requests', () => {
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

  describe('tagSetList', () => {
    it('returns a list of all fetched tagSet', () => {
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
    it('returns a list of all fetched tagSet', () => {
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

  describe('selectedRequests', () => {
    const payload = ontPlateFactory.content
    const defaultStateObject = defaultState()
    const plateResources = payload.data
    const { wells: wellResources, requests: requestResources } = groupIncludedByResource(
      payload.included,
    )
    const requests = dataToObjectById({ data: requestResources, includeRelationships: true })
    const wells = dataToObjectById({ data: wellResources, includeRelationships: true })
    const plates = dataToObjectById({ data: plateResources, includeRelationships: true })

    const libraries = {
      8: {
        ont_request_id: '8',
        tag_id: null,
        volume: null,
        concentration: null,
        insert_size: null,
      }, // a selected request
      7: {
        ont_request_id: '7',
        tag_id: null,
        volume: null,
        concentration: null,
        insert_size: null,
      }, // a selected request
      6: {
        ont_request_id: '6',
        tag_id: null,
        volume: null,
        concentration: null,
        insert_size: null,
      }, // a selected request
    }

    const state = {
      ...defaultStateObject,
      resources: { ...defaultStateObject.resources, requests, wells, plates },
      pooling: { libraries },
    }

    it('returns an array of request resources that have been selected', () => {
      expect(selectedRequests(state)).toEqual([
        { ...requests['6'], selected: true },
        { ...requests['7'], selected: true },
        { ...requests['8'], selected: true },
      ])
    })
  })

  describe('pools', () => {
    const payload = ontPoolFactory.content
    const defaultStateObject = defaultState()
    const poolResources = payload.data
    const {
      libraries: libraryResources,
      requests: requestResources,
      tags: tagResources,
      tubes: tubeResources,
    } = groupIncludedByResource(payload.included)
    const libraries = dataToObjectById({ data: libraryResources, includeRelationships: true })
    const requests = dataToObjectById({ data: requestResources, includeRelationships: true })
    const tags = dataToObjectById({ data: tagResources, includeRelationships: true })
    const tubes = dataToObjectById({ data: tubeResources, includeRelationships: true })
    const pool = dataToObjectById({ data: poolResources, includeRelationships: true })

    const state = {
      ...defaultStateObject,
      resources: { ...defaultStateObject.resources, libraries, requests, tags, tubes, pools: pool },
    }

    it('returns an array of request resources that have been selected', () => {
      expect(pools(state))

      const poolState = pools(state)

      // we need to sort it as they are in opposite order
      const poolData = ontPoolFactory.content.data.sort((a, b) => a.id - b.id)

      expect(poolState.length).toEqual(poolData.length)

      expect(poolState[0].id).toEqual(poolData[0].id)
      expect(poolState[1].id).toEqual(poolData[1].id)
      expect(poolState[2].id).toEqual(poolData[2].id)

      // this is ugly. Still not worth tacking until we refactor
      expect(poolState[0].barcode).toEqual(
        ontPoolFactory.storeData.tubes.find(
          (tube) => tube.id === poolData[0].relationships.tube.data.id,
        ).attributes.barcode,
      )

      expect(poolState[0].libraries[0].id).toEqual(poolData[0].relationships.libraries.data[0].id)
    })
  })
})
