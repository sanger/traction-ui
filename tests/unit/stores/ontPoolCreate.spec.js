import {
  createPinia,
  setActivePinia,
  // successfulResponse,
  failedResponse,
} from '@support/testHelper.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'
// import { useOntRootStore } from '@/stores/ontRoot.js'
import useRootStore from '@/stores'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import OntRequestFactory from '@tests/factories/OntRequestFactory.js'
import OntPlateFactory from '@tests/factories/OntPlateFactory.js'
import OntPoolFactory from '@tests/factories/OntPoolFactory.js'

const ontRequestFactory = OntRequestFactory()
const ontPlateFactory = OntPlateFactory()
const ontPoolFactory = OntPoolFactory()
// const singleOntPoolFactory = OntPoolFactory({ count: 1 })

vi.mock('@/api/FeatureFlag', () => ({
  checkFeatureFlag: vi.fn().mockReturnValue(true),
}))

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

describe('useOntPoolCreateStore', () => {
  let store

  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
    store = useOntPoolCreateStore()
  })

  describe('getters', () => {
    describe('requests', () => {
      it('return the requests', () => {
        store.resources.requests = ontRequestFactory.storeData
        expect(store.requests).toEqual(Object.values(ontRequestFactory.storeData))
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
        store.pooling.pool = pool
        expect(store.poolItem).toEqual(pool)
      })

      it('when the pool does not exist', () => {
        store.pooling.pool = undefined
        expect(store.poolItem).toEqual({})
      })
    })

    describe('tubeItem', () => {
      const tube = {
        id: 1,
        barcode: 'GEN-1668092750-4',
      }
      it('returns the tube data', () => {
        store.pooling.tube = tube
        expect(store.tubeItem).toEqual(tube)
      })

      it('when the tube does not exist', () => {
        store.pooling.tube = undefined
        expect(store.tubeItem).toEqual({})
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
        store.pooling.libraries = libraries
        expect(store.libraryItem('3')).toEqual(libraries['3'])
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
        store.selected.plates = plates
        expect(store.selectedPlates).toEqual(Object.values(plates))
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
        store.selected.tubes = tubes
        expect(store.selectedTubes).toEqual(Object.values(tubes))
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
        store.resources.wells = wells
        expect(store.wellList()).toEqual(wells.values)
      })

      it('when ids are included', () => {
        store.resources.wells = wells
        const ids = ['1', '2', '3']
        expect(store.wellList(ids).length).toEqual(ids.length)
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
        store.resources.requests = requests
        store.pooling.libraries = libraries
        expect(store.requestList()).toEqual(mergedRequests)
      })

      it('when ids are included', () => {
        store.resources.requests = requests
        store.pooling.libraries = libraries
        const ids = ['1', '2', '3']
        expect(store.requestList(ids).length).toEqual(ids.length)
      })
    })
    describe('tagSetList', () => {
      it('returns a list of all fetched tagSet', () => {
        store.resources.tagSets = tagSets
        expect(store.tagSetList).toEqual(Object.values(tagSets))
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
        store.resources.tags = tags
        expect(store.tagList()).toEqual(tags.values)
      })
      it('when ids are included', () => {
        store.resources.tags = tags
        const ids = ['1', '2', '3']
        expect(store.tagList(ids).length).toEqual(ids.length)
      })
    })

    describe('selectedTagSet', () => {
      it('returns the selected tag set', () => {
        const tagSet = { id: '1' }
        store.selected.tagSet = tagSet
        store.resources.tagSets = tagSets
        expect(store.selectedTagSet).toEqual(tagSets['1'])
      })
    })

    describe('selectedRequests', () => {
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

      it('returns an array of request resources that have been selected', () => {
        store.pooling.libraries = libraries
        store.resources = ontPlateFactory.storeData.resources
        const expectedSelectedRequests = Object.values(libraries).map((library) => ({
          ...ontPlateFactory.storeData.resources.requests[library.ont_request_id],
          selected: true,
        }))
        expect(store.selectedRequests).toEqual(expectedSelectedRequests)
      })
    })

    describe('pools', () => {
      it('returns an array of request resources that have been selected', () => {
        store.resources = ontPoolFactory.storeData.resources

        // we need to sort it as they are in opposite order
        const poolData = ontPoolFactory.content.data.sort((a, b) => a.id - b.id)

        expect(store.pools.length).toEqual(poolData.length)

        expect(store.pools[0].id).toEqual(poolData[0].id)
        expect(store.pools[1].id).toEqual(poolData[1].id)
        expect(store.pools[2].id).toEqual(poolData[2].id)

        // this is ugly. Still not worth tacking until we refactor
        expect(store.pools[0].barcode).toEqual(
          ontPoolFactory.storeData.tubes.find(
            (tube) => tube.id === poolData[0].relationships.tube.data.id,
          ).attributes.barcode,
        )

        // I degraded this test as to not have to deal with the nested data
        // this is a good candidate for a refactor
        expect(store.pools[0].libraries[0].id).toEqual(
          poolData[0].relationships.libraries.data[0].id,
        )
      })
    })
  })

  describe('actions', () => {
    let rootStore

    beforeEach(() => {
      rootStore = useRootStore()
    })

    describe('fetchOntRequests', () => {
      let get

      beforeEach(() => {
        get = vi.fn()
        rootStore.api = { traction: { ont: { requests: { get } } } }
      })

      it('handles success', async () => {
        get.mockResolvedValue(ontRequestFactory.responses.fetch)
        const { success } = await store.fetchOntRequests()
        expect(store.resources.requests).toEqual(ontRequestFactory.storeData)
        expect(success).toEqual(true)
      })

      it('handles failure', async () => {
        get.mockResolvedValue(failedResponse)
        const { success } = await store.fetchOntRequests()
        expect(store.resources.requests).toEqual({})
        expect(success).toEqual(false)
      })
    })

    describe('fetchOntPools', () => {
      it('handles success', async () => {
        // mock dependencies
        const get = vi.fn()
        rootStore.api = { traction: { ont: { pools: { get } } } }
        get.mockResolvedValue(ontPoolFactory.responses.fetch)
        const { success } = await store.fetchOntPools()
        expect(store.resources.libraries).toEqual(ontPoolFactory.storeData.resources.libraries)
        expect(store.resources.tags).toEqual(ontPoolFactory.storeData.resources.tags)
        expect(store.resources.requests).toEqual(ontPoolFactory.storeData.resources.requests)
        expect(store.resources.tubes).toEqual(ontPoolFactory.storeData.resources.tubes)
        expect(success).toEqual(true)
      })

      it('handles failure', async () => {
        // mock dependencies
        const get = vi.fn()
        rootStore.api = { traction: { ont: { pools: { get } } } }
        get.mockResolvedValue(failedResponse)
        // apply action
        const { success } = await store.fetchOntPools()
        expect(success).toEqual(false)
      })
    })
  })
})
