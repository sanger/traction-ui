import mutations from '@/store/traction/ont/pools/mutations'
import defaultState from '@/store/traction/ont/pools/state'
import { describe, expect, it } from 'vitest'
import Contracts from './contracts'
import { Data } from '@support/testHelper'
import { dataToObjectById } from '@/api/JsonApi'
import OntTagSetFactory from '@tests/factories/OntTagSetFactory.js'

const ontTagSetFactory = OntTagSetFactory()

describe('mutations', () => {
  const {
    populateTags,
    populateTagSets,
    populateRequests,
    populateWells,
    populateTubes,
    populatePlates,
    populateLibraries,
    setPools,
    populatePools,
    populatePoolingTube,
    populatePoolAttributes,
    populatePoolingLibraries,
    updatePoolingLibrary,
    clearPoolData,
    selectTagSet,
    selectRequest,
    selectTube,
    selectPlate,
    removeResource,
  } = mutations

  describe('populateRequests', () => {
    it('updates the state', () => {
      // mock state
      const requests = Contracts.requests.populateRequestsParameters
      const state = defaultState()
      // apply mutation
      populateRequests(state, requests)
      // assert result
      expect(state.resources.requests).toEqual(Contracts.requests.storeData)
    })
  })

  describe('selectPlate', () => {
    it('selects a plate by default', () => {
      // mock state
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        selected: {
          ...defaultStateObject.selected,
          plates: {
            2: { id: '2', selected: true },
          },
        },
      }
      // apply mutation
      selectPlate(state, { id: '1' })
      expect(state.selected.plates).toEqual({
        1: { id: '1', selected: true },
        2: { id: '2', selected: true },
      })
    })

    it('unselects plates', () => {
      // mock state
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        selected: {
          ...defaultStateObject.selected,
          plates: {
            2: { id: '2', selected: true },
          },
        },
      }
      // apply mutation
      selectPlate(state, { id: '2', selected: false })
      expect(state.selected.plates).toEqual({})
    })
  })

  describe('selectTube', () => {
    it('selects a tube by default', () => {
      // mock state
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        selected: {
          ...defaultStateObject.selected,
          tubes: {
            2: { id: '2', selected: true },
          },
        },
      }
      // apply mutation
      selectTube(state, { id: '1' })
      expect(state.selected.tubes).toEqual({
        1: { id: '1', selected: true },
        2: { id: '2', selected: true },
      })
    })

    it('unselects tubes', () => {
      // mock state
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        selected: {
          ...defaultStateObject.selected,
          tubes: {
            2: { id: '2', selected: true },
          },
        },
      }
      // apply mutation
      selectTube(state, { id: '2', selected: false })
      expect(state.selected.tubes).toEqual({})
    })
  })

  describe('selectRequest', () => {
    it('selects a request by default', () => {
      // mock state
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        pooling: {
          ...defaultStateObject.pooling,
          libraries: {
            2: {
              ont_request_id: '2',
              tag_id: null,
              kit_barcode: null,
              volume: null,
              concentration: null,
              insert_size: null,
            },
          },
        },
      }

      // apply mutation
      selectRequest(state, { id: '1' })
      expect(state.pooling.libraries).toEqual({
        2: {
          ont_request_id: '2',
          tag_id: null,
          kit_barcode: null,
          volume: null,
          concentration: null,
          insert_size: null,
        },
        1: {
          ont_request_id: '1',
          tag_id: null,
          kit_barcode: null,
          volume: null,
          concentration: null,
          insert_size: null,
        },
      })
    })

    it('unselects requests', () => {
      // mock state
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        pooling: {
          ...defaultStateObject.pooling,
          libraries: {
            2: {
              ont_request_id: '2',
              tag_id: null,
              kit_barcode: null,
              volume: null,
              concentration: null,
              insert_size: null,
            },
          },
        },
      }
      // apply mutation
      selectRequest(state, { id: '2', selected: false })
      expect(state.pooling.libraries).toEqual({})
    })
  })

  describe('selectTagSet', () => {
    it('updates the state', () => {
      const tagSets = {
        1: {
          'id:': '1',
          name: 'tagSet1',
          tags: ['1', '2'],
        },
        2: {
          'id:': '2',
          name: 'tagSet2',
        },
      }

      const tags = {
        1: {
          id: '1',
          name: 'tag1',
        },
        2: {
          id: '2',
          name: 'tag2',
        },
        3: {
          id: '3',
          name: 'tag3',
        },
        4: {
          id: '4',
          name: 'tag4',
        },
      }
      // mock state
      const state = defaultState()
      state.resources.tagSets = tagSets
      state.resources.tags = tags
      // apply mutation
      selectTagSet(state, { id: '1' })
      // assert result
      expect(state.selected.tagSet).toEqual({ id: '1' })
    })
  })

  describe('clearPoolData', () => {
    it('clears existing pool data', () => {
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        pooling: {
          tube: {
            id: '1',
            barcode: 'barcode',
          },
          libraries: {
            2: {
              ont_request_id: '2',
              tag_id: null,
              kit_barcode: null,
              volume: null,
              concentration: null,
              insert_size: null,
            },
          },
          pool: {
            id: '1',
          },
        },
        selected: {
          tagSet: {
            id: '2',
          },
          plates: {
            1: {
              id: '1',
              selected: true,
            },
          },
          tube: {
            1: {
              id: '1',
              selected: true,
            },
          },
        },
      }
      // populates an existing pool into state
      clearPoolData(state)
      expect(state.selected).toEqual({
        tagSet: {},
        plates: {},
        tubes: {},
      })
      expect(state.pooling).toEqual({
        libraries: {},
        pool: {},
        tube: {},
      })
    })
  })

  describe('updatePoolingLibrary', () => {
    it('updates a selected library', () => {
      // mock state
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        pooling: {
          ...defaultStateObject.pooling,
          libraries: {
            2: {
              ont_request_id: '2',
              tag_id: null,
              kit_barcode: null,
              volume: null,
              concentration: null,
              insert_size: null,
            },
          },
        },
      }

      // apply mutation
      updatePoolingLibrary(state, {
        ont_request_id: '2',
        tag_id: null,
        kit_barcode: null,
        volume: '30',
        concentration: '20',
        insert_size: null,
      })
      expect(state.pooling.libraries).toEqual({
        2: {
          ont_request_id: '2',
          tag_id: null,
          kit_barcode: null,
          volume: '30',
          concentration: '20',
          insert_size: null,
        },
      })
    })
  })

  describe('populatePoolingLibraries', () => {
    it('populates the pooling libraries', () => {
      const expectedPoolingLibraries = {
        1: {
          ont_request_id: '1',
          kit_barcode: 'barcode-0',
          tag_id: null,
          volume: 8,
          concentration: 4,
          insert_size: 4068,
          id: '1',
          type: 'libraries',
          created_at: '2022/12/02 14:18',
          deactivated_at: null,
          state: 'pending',
          request: '1',
          tube: undefined,
          tag: null,
          pool: '1',
          source_well: undefined,
          source_plate: undefined,
          source_tube: undefined,
        },
        2: {
          ont_request_id: '2',
          kit_barcode: 'barcode-1',
          tag_id: null,
          volume: 7,
          concentration: 7,
          insert_size: 8247,
          id: '2',
          type: 'libraries',
          created_at: '2022/12/02 14:18',
          deactivated_at: null,
          state: 'pending',
          request: '2',
          tube: undefined,
          tag: null,
          pool: '2',
          source_well: undefined,
          source_plate: undefined,
          source_tube: undefined,
        },
        3: {
          ont_request_id: '3',
          kit_barcode: 'barcode-2',
          tag_id: null,
          volume: 3,
          concentration: 3,
          insert_size: 8683,
          id: '3',
          type: 'libraries',
          created_at: '2022/12/02 14:18',
          deactivated_at: null,
          state: 'pending',
          request: '3',
          tube: undefined,
          tag: null,
          pool: '3',
          source_well: undefined,
          source_plate: undefined,
          source_tube: undefined,
        },
        4: {
          ont_request_id: '4',
          kit_barcode: 'barcode-3',
          tag_id: null,
          volume: 4,
          concentration: 6,
          insert_size: 6997,
          id: '4',
          type: 'libraries',
          created_at: '2022/12/02 14:18',
          deactivated_at: null,
          state: 'pending',
          request: '4',
          tube: undefined,
          tag: null,
          pool: '4',
          source_well: undefined,
          source_plate: undefined,
          source_tube: undefined,
        },
      }

      const state = defaultState()
      // apply mutation
      populatePoolingLibraries(state, Data.tractionOntLibraries.data.data)

      expect(state.pooling.libraries).toEqual(expectedPoolingLibraries)
    })
  })

  describe('populatePoolAttributes', () => {
    it('sets the pool with the correct data', () => {
      const state = defaultState()
      // apply mutation
      populatePoolAttributes(state, Data.TractionOntPool.data.data)
      expect(state.pooling.pool).toEqual(
        expect.objectContaining({
          id: '3',
          volume: 4,
          concentration: 8,
          kit_barcode: 'barcode-2',
          insert_size: 8251,
          source_identifier: 'GEN-1668092750-1:C1-D1',
        }),
      )
    })
  })

  describe('populatePoolingTube', () => {
    it('sets the tube with the correct data', () => {
      const tube = { id: 1, attributes: { barcode: 'TRAC-1' } }
      const state = defaultState()
      //apply mutation
      populatePoolingTube(state, tube)
      expect(state.pooling.tube).toEqual({
        id: 1,
        barcode: 'TRAC-1',
      })
    })
  })

  describe('populatePools', () => {
    it('updates the state', () => {
      // mock state
      const pools = Data.TractionOntPools.data.data
      const state = defaultState()
      // apply mutation
      populatePools(state, pools)
      // assert result
      expect(state.resources.pools).toEqual(
        dataToObjectById({ data: pools, includeRelationships: true }),
      )
    })
  })

  describe('setPools', () => {
    it('updates the state', () => {
      // mock state
      const pools = Data.TractionOntPools.data.data
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        resources: {
          pools: {
            1: {
              id: '1',
              volume: '10',
            },
          },
        },
      }
      // apply mutation
      setPools(state, pools)
      // assert result
      expect(state.resources.pools).toEqual(
        dataToObjectById({ data: pools, includeRelationships: true }),
      )
    })
  })

  describe('populateLibraries', () => {
    it('updates the state', () => {
      // mock state
      const libraries = Data.tractionOntLibraries.data.data
      const state = defaultState()
      // apply mutation
      populateLibraries(state, libraries)
      // assert result
      expect(state.resources.libraries).toEqual(
        dataToObjectById({ data: libraries, includeRelationships: true }),
      )
    })
  })

  describe('populatePlates', () => {
    it('updates the state', () => {
      // mock state
      const plates = Data.OntPlates.data.data
      const state = defaultState()
      // apply mutation
      populatePlates(state, plates)
      // assert result
      expect(state.resources.plates).toEqual(
        dataToObjectById({ data: plates, includeRelationships: true }),
      )
    })
  })

  describe('populateTubes', () => {
    it('updates the state', () => {
      // mock state
      const tubes = Data.OntTubesRequest.data.data
      const state = defaultState()
      // apply mutation
      populateTubes(state, tubes)
      // assert result
      expect(state.resources.tubes).toEqual(
        dataToObjectById({ data: tubes, includeRelationships: true }),
      )
    })
  })

  describe('populateWells', () => {
    it('updates the state', () => {
      // mock state
      const wells = Data.OntPlatesRequest.data.included.slice(0, 8)
      const state = defaultState()
      // apply mutation
      populateWells(state, wells)
      // assert result
      expect(state.resources.wells).toEqual(
        dataToObjectById({ data: wells, includeRelationships: true }),
      )
    })
  })

  describe('setRequests', () => {
    it('updates the state', () => {
      // mock state
      const requests = Data.TractionOntRequests.data.data
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        resources: {
          requests: {
            102: {
              id: '102',
              library_type: 'library_type',
              data_type: 'data_type',
            },
          },
        },
      }
      // apply mutation
      populateRequests(state, requests)
      // assert result
      expect(state.resources.requests).toEqual(
        dataToObjectById({ data: requests, includeRelationships: true }),
      )
    })
  })

  describe('populateRequests', () => {
    it('updates the state', () => {
      // mock state
      const requests = Data.TractionOntRequests.data.data
      const state = defaultState()
      // apply mutation
      populateRequests(state, requests)
      // assert result
      expect(state.resources.requests).toEqual(
        dataToObjectById({ data: requests, includeRelationships: true }),
      )
    })
  })

  describe('populateTagSets', () => {
    it('updates the state', () => {
      // mock state
      const tagSets = ontTagSetFactory.content.data
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
      const tags = Data.TractionOntRequests.data.included
      const state = defaultState()
      // apply mutation
      populateTags(state, tags)
      // assert result
      expect(state.resources.tags).toEqual(
        dataToObjectById({ data: tags, includeRelationships: true }),
      )
    })
  })

  describe('removeResource', () => {
    it('with a plate updates the state', () => {
      // mock state
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        resources: {
          ...defaultStateObject.resources,
          plates: {
            1: { id: 1, wells: ['10', '20'] },
            2: { id: 2, wells: ['11'] },
          },
        },
      }
      // apply mutation
      removeResource(state, { resource: 'plates', id: '1' })
      // assert result
      expect(state.resources.plates).toEqual({ 2: { id: 2, wells: ['11'] } })
    })

    it('with a well updates the state', () => {
      // mock state
      const defaultStateObject = defaultState()
      const state = {
        ...defaultStateObject,
        resources: {
          ...defaultStateObject.resources,
          wells: {
            10: { id: '10', type: 'wells', position: 'A1', requests: ['100', '300'] },
            11: { id: '11', type: 'wells', position: 'A2', requests: ['50'] },
          },
        },
      }
      // apply mutation
      removeResource(state, { resource: 'wells', id: '10' })
      // assert result
      expect(state.resources.wells).toEqual({
        11: { id: '11', type: 'wells', position: 'A2', requests: ['50'] },
      })
    })
  })
})
