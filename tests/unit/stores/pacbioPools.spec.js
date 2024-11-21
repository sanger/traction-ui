import { createPinia, setActivePinia } from 'pinia'
import { usePacbioPoolsStore } from '@/stores/pacbioPools.js'
import useRootStore from '@/stores'
import { expect } from 'vitest'
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
        get.mockResolvedValue(pacbioPoolFactory.responses.axios)
        await store.fetchPools()
        expect(store.pools).toEqual(pacbioPoolFactory.storeData.pools)
        expect(store.tubes).toEqual(pacbioPoolFactory.storeData.tubes)
        expect(store.used_aliquots).toEqual(pacbioPoolFactory.storeData.used_aliquots)
        expect(store.tags).toEqual(pacbioPoolFactory.storeData.tags)
        expect(store.requests).toEqual(pacbioPoolFactory.storeData.requests)
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
