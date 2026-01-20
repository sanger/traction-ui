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

    describe('setMultiPool', () => {
      it('for a new multi pool', async () => {
        const id = 'new'
        const { success } = await store.setMultiPool({ id })
        expect(success).toBeTruthy()
        expect(store.$state.multiPool).toEqual({
          pipeline: 'Pacbio',
          pooling_layout: 'Plate',
        })
      })

      it('for an existing multi pool', async () => {
        const id = 1
        store.fetchMultiPool = vi.fn().mockResolvedValue({ success: true })

        const { success } = await store.setMultiPool({ id })
        expect(store.fetchMultiPool).toHaveBeenCalledWith(id)
        expect(success).toBeTruthy()
      })

      it('for an existing multi pool when fetchMultiPool fails', async () => {
        const id = 1
        store.fetchMultiPool = vi.fn().mockResolvedValue({ success: false })

        const { success } = await store.setMultiPool({ id })
        expect(store.fetchMultiPool).toHaveBeenCalledWith(id)
        expect(success).toBeFalsy()
      })
    })

    describe('getPool', () => {
      it('returns the pool at the given position', () => {
        store.$state.multiPoolPositions = {
          A1: { id: 1, position: 'A1', type: 'MultiPoolPosition' },
          B2: { id: 2, position: 'B2', type: 'MultiPoolPosition' },
        }

        const poolA1 = store.getPool('A1')
        expect(poolA1).toEqual({ id: 1, position: 'A1', type: 'MultiPoolPosition' })

        const poolB2 = store.getPool('B2')
        expect(poolB2).toEqual({ id: 2, position: 'B2', type: 'MultiPoolPosition' })
      })

      it('returns an empty object if no pool exists at the given position', () => {
        store.$state.multiPoolPositions = {
          A1: { id: 1, position: 'A1', type: 'MultiPoolPosition' },
        }

        const pool = store.getPool('C3')
        expect(pool).toEqual({})
      })
    })

    describe('clearData', () => {
      it('clears existing multi pool data', () => {
        const store = useMultiPoolCreateStore()
        store.$state = {
          multiPool: { id: 1, pooling_layout: 'Plate', pipeline: 'Pacbio' },
          multiPoolPositions: {
            1: { id: 1, position: 'A1' },
            2: { id: 2, position: 'A2' },
          },
        }

        store.clearData()

        expect(store.$state).toEqual({
          multiPool: {},
          multiPoolPositions: {},
        })
      })
    })
  })
})
