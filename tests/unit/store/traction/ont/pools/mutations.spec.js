import mutations from '@/store/traction/ont/pools/mutations'
import defaultState from '@/store/traction/ont/pools/state'
import { describe, expect, it } from 'vitest'
import { dataToObjectById } from '@/api/JsonApi'
import OntTagSetFactory from '@tests/factories/OntTagSetFactory.js'
import OntRequestFactory from '@tests/factories/OntRequestFactory.js'
import OntLibraryFactory from '@tests/factories/OntLibraryFactory.js'
import OntPoolFactory from '@tests/factories/OntPoolFactory.js'
import OntPlateFactory from '@tests/factories/OntPlateFactory.js'
import OntTubeFactory from '@tests/factories/OntTubeFactory.js'

const ontTagSetFactory = OntTagSetFactory()
const ontRequestFactory = OntRequestFactory()
const ontLibraryFactory = OntLibraryFactory()
const ontPoolFactory = OntPoolFactory()
const singleOntPoolFactory = OntPoolFactory({ count: 1 })
const ontPlateFactory = OntPlateFactory()
const ontTubeFactory = OntTubeFactory()

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
      const requests = ontRequestFactory.content.data
      const state = defaultState()
      // apply mutation
      populateRequests(state, requests)
      // assert result
      expect(state.resources.requests).toEqual(ontRequestFactory.storeData)
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
      const state = defaultState()
      // apply mutation
      populatePoolingLibraries(state, ontLibraryFactory.content.data)

      expect(state.pooling.libraries).toEqual(ontLibraryFactory.storeData.poolingLibraries)
    })
  })

  describe('populatePoolAttributes', () => {
    it.skip('sets the pool with the correct data', () => {
      const state = defaultState()
      // apply mutation
      populatePoolAttributes(state, singleOntPoolFactory.content.data)
      expect(state.pooling.pool).toEqual(singleOntPoolFactory.storeData.pooling.pool)
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
      const pools = ontPoolFactory.content.data
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
      const pools = ontPoolFactory.content.data
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
      const libraries = ontLibraryFactory.content.data
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
      const plates = ontPlateFactory.content.data
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
      const tubes = ontTubeFactory.content.data
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
      const wells = ontPlateFactory.storeData.wells
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
      const requests = ontRequestFactory.content.data
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
      const requests = ontRequestFactory.content.data
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
      const tags = ontTagSetFactory.content.included
      const state = defaultState()
      // apply mutation
      populateTags(state, tags)
      // assert result
      expect(state.resources.tags).toEqual(dataToObjectById({ data: tags }))
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
