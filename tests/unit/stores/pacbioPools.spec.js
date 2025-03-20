import { createPinia, setActivePinia } from 'pinia'
import { usePacbioPoolsStore } from '@/stores/pacbioPools.js'
import useRootStore from '@/stores'
import { expect } from 'vitest'
import PacbioPoolFactory from '@tests/factories/PacbioPoolFactory.js'
import { addUsedAliquotsAndErrorsToPools } from '@/stores/utilities/pool.js'
import { failedResponse } from '@support/testHelper.js'

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
      expect(store.poolsArray).toEqual(addUsedAliquotsAndErrorsToPools(pacbioPoolFactory.storeData))
    })
  })
  describe('actions', () => {
    describe('#fetchPools', () => {
      let get, rootStore, store

      beforeEach(() => {
        get = vi.fn()
        store = usePacbioPoolsStore()
        rootStore = useRootStore()
        rootStore.api.traction.pacbio.pools.get = get
      })

      it('successfully', async () => {
        get.mockResolvedValue(pacbioPoolFactory.responses.fetch)
        await store.fetchPools()
        expect(store.pools).toEqual(pacbioPoolFactory.storeData.pools)
        expect(store.used_aliquots).toEqual(pacbioPoolFactory.storeData.used_aliquots)
        expect(store.tags).toEqual(pacbioPoolFactory.storeData.tags)
        expect(store.requests).toEqual(pacbioPoolFactory.storeData.requests)
      })

      it('unsuccessfully', async () => {
        const mockResponse = failedResponse()
        get.mockResolvedValue(mockResponse)
        const { success, errors } = await store.fetchPools()
        expect(success).toEqual(false)
        expect(errors).toEqual(mockResponse.errorSummary)
      })
    })
  })
})
