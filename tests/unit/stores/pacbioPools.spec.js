import { createPinia, setActivePinia } from 'pinia'
import { usePacbioPoolsStore } from '@/stores/pacbioPools.js'
import { Data } from '@support/testHelper.js'
import useRootStore from '@/stores'
import { expect } from 'vitest'
import * as jsonapi from '@/api/JsonApi.js'
import PacbioPoolFactory from '@tests/factories/PacbioPoolFactory.js'
import { addUsedAliquotsBarcodeAndErrorsToPools } from '@/stores/utilities/pool.js'

const pacbioPoolFactory = PacbioPoolFactory()

describe('usePacbioPools', () => {
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('getters', () => {
    let store
    beforeEach(() => {
      store = usePacbioPoolsStore()
      store.$state = pacbioPoolFactory.storeData
    })
    it('"poolsArrays" returns denormalized pools from "state.pools"', () => {
      expect(store.poolsArray).toEqual(
        addUsedAliquotsBarcodeAndErrorsToPools(pacbioPoolFactory.storeData),
      )
    })
  })
  describe('actions', () => {
    describe('#fetchPools', () => {
      let get, failedResponse, rootStore, store

      beforeEach(() => {
        get = vi.fn()
        store = usePacbioPoolsStore()
        rootStore = useRootStore()
        rootStore.api.v1.traction.pacbio.pools.get = get
        failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
      })

      it('successfully', async () => {
        const response = Data.TractionPacbioPoolsWithAliquots
        const { data: pools, included } = response.data
        get.mockResolvedValue(response)

        await store.fetchPools()
        expect(store.pools).toEqual(
          jsonapi.dataToObjectById({ data: pools, includeRelationships: true }),
        )
        expect(store.tubes).toEqual(jsonapi.dataToObjectById({ data: included.slice(0, 2) }))
        expect(store.used_aliquots).toEqual(
          jsonapi.dataToObjectById({ data: included.slice(2, 4), includeRelationships: true }),
        )
        expect(store.tags).toEqual(jsonapi.dataToObjectById({ data: included.slice(4, 6) }))
        expect(store.requests).toEqual(jsonapi.dataToObjectById({ data: included.slice(6, 8) }))
      })

      it('when the pool has no used_aliquots', async () => {
        const response = Data.TractionPacbioPoolsNoRelationships
        const { data: pools } = response.data
        get.mockResolvedValue(response)
        await store.fetchPools()
        expect(store.pools).toEqual(
          jsonapi.dataToObjectById({ data: pools, includeRelationships: true }),
        )
      })

      it('unsuccessfully', async () => {
        get.mockRejectedValue(failedResponse)
        const { success, errors } = await store.fetchPools()
        expect(success).toEqual(false)
        expect(errors).toEqual(failedResponse)
      })
    })
  })
})
