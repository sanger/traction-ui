import { useMultiPoolStore } from '@/stores/multiPools.js'
import { beforeEach, describe, expect } from 'vitest'
import MultiPoolFactory from '@tests/factories/MultiPoolFactory.js'
import useRootStore from '@/stores'
import { failedResponse } from '@tests/support/testHelper.js'

const multiPoolFactory = MultiPoolFactory()

describe('useMultiPoolStore', () => {
  let store

  beforeEach(() => {
    store = useMultiPoolStore()
  })

  describe('getters', () => {
    it('multiPoolItems', () => {
      store.$state.resources.multiPools = multiPoolFactory.storeData.resources.multiPools
      const expected = Object.values(store.resources.multiPools)
      expect(store.multiPoolItems).toEqual(expected)
    })
  })

  describe('actions', () => {
    let rootStore

    beforeEach(() => {
      rootStore = useRootStore()
    })
    describe('fetchMultiPools', () => {
      let get

      beforeEach(() => {
        get = vi.fn()
        rootStore.api = { traction: { multi_pools: { get } } }
      })

      it('runs successfully', async () => {
        get.mockResolvedValue(multiPoolFactory.responses.fetch)
        const { success } = await store.fetchMultiPools()
        expect(store.resources.multiPools).toEqual(multiPoolFactory.storeData.resources.multiPools)
        expect(success).toBe(true)
      })
      it('handles failure', async () => {
        get.mockResolvedValue(failedResponse())
        const { success } = await store.fetchMultiPools()
        expect(store.resources.multiPools).toEqual({})
        expect(success).toBe(false)
      })
    })
  })
})
