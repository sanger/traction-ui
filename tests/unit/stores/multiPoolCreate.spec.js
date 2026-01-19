import { useMultiPoolCreateStore } from '@/stores/multiPoolCreate.js'
import { beforeEach, describe } from 'vitest'
import useRootStore from '@/stores'
import { failedResponse } from '@tests/support/testHelper.js'

describe('useMultiPoolCreateStore', () => {
  let store

  beforeEach(() => {
    store = useMultiPoolCreateStore()
  })

  describe.skip('getters', () => {
    it('multiPoolPositionItems', () => {})
  })

  describe('actions', () => {
    let rootStore

    beforeEach(() => {
      rootStore = useRootStore()
    })

    describe('fetchMultiPool', () => {
      let find

      beforeEach(() => {
        find = vi.fn()
        rootStore.api = { traction: { multi_pools: { find } } }
      })

      it.skip('handles success', async () => {})

      it.skip('adds the multi_pool and multi_pool_positions data to the store', async () => {})

      it('handles failure', async () => {
        find.mockResolvedValue(failedResponse(500))
        const { success } = await store.fetchMultiPool()
        expect(success).toEqual(false)
      })
    })
  })
})
