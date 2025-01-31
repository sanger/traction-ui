import {
  createPinia,
  setActivePinia,
  // successfulResponse,
  // failedResponse,
} from '@support/testHelper.js'
import { useOntPoolCreateStore } from '@/stores/ontPoolCreate.js'
// import { useOntRootStore } from '@/stores/ontRoot.js'
// import useRootStore from '@/stores'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import OntRequestFactory from '@tests/factories/OntRequestFactory.js'

const ontRequestFactory = OntRequestFactory()

vi.mock('@/api/FeatureFlag', () => ({
  checkFeatureFlag: vi.fn().mockReturnValue(true),
}))

describe('useOntPoolCreateStore', () => {
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('getters', () => {
    let store

    beforeEach(() => {
      store = useOntPoolCreateStore()
    })

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
  })
})
