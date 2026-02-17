import { useMultiPoolCreateStore } from '@/stores/multiPoolCreate.js'
import { successfulResponse, failedResponse } from '@support/testHelper.js'
import { beforeEach, describe } from 'vitest'
import { multiPoolPayload } from '@/stores/utilities/multiPool.js'
import MultiPoolFactory from '@tests/factories/MultiPoolFactory.js'
import useRootStore from '@/stores'

describe('useMultiPoolCreateStore', () => {
  let store

  beforeEach(() => {
    store = useMultiPoolCreateStore()
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

      it('handles success', async () => {
        const find = vi.fn()
        const singleMultiPoolFactory = MultiPoolFactory.single()
        rootStore.api = { traction: { multi_pools: { find } } }
        find.mockResolvedValue(singleMultiPoolFactory.responses.fetch)
        const { success, errors } = await store.fetchMultiPool('1')
        expect(success).toEqual(true)
        expect(store.multiPool).toEqual(singleMultiPoolFactory.storeData.multiPool)
        expect(store.multiPoolPositions).toEqual(
          singleMultiPoolFactory.storeData.multi_pool_positions,
        )
        expect(errors).toEqual([])
        expect(find).toHaveBeenCalledWith({ id: '1', include: 'multi_pool_positions' })
      })

      it('handles failure', async () => {
        const failureResponse = failedResponse()
        const find = vi.fn()
        rootStore.api = { traction: { multi_pools: { find } } }
        find.mockResolvedValue(failureResponse)
        const { success, errors } = await store.fetchMultiPool('1')
        expect(success).toEqual(false)
        // Default values if fetch fails
        expect(store.multiPool).toEqual({ pipeline: 'pacbio', pool_method: 'Plate' })
        expect(store.multiPoolPositions).toEqual({})
        expect(errors).toEqual(failureResponse.errorSummary)
        expect(find).toHaveBeenCalledWith({ id: '1', include: 'multi_pool_positions' })
      })
    })

    describe('createMultiPool', () => {
      let create

      beforeEach(() => {
        create = vi.fn()
        rootStore.api = { traction: { multi_pools: { create } } }
      })

      it('handles success', async () => {
        const mockResponse = successfulResponse({
          data: { attributes: { barcode: 'TRAC-2-1' } },
        })
        store.multiPool = { pooling_method: 'Plate', pipeline: 'pacbio' }
        create.mockResolvedValue(mockResponse)

        const { success, barcode, errors } = await store.createMultiPool()

        expect(success).toBeTruthy()
        expect(create).toHaveBeenCalledWith({
          data: multiPoolPayload({ multiPool: store.multiPool, multiPoolPositions: store.multiPoolPositions }),
        })
        expect(barcode).toEqual('TRAC-2-1')
        expect(errors).toEqual(undefined)
      })

      it('handles failure', async () => {
        const mockResponse = failedResponse(422)
        create.mockResolvedValue(mockResponse)

        const { success, barcode, errors } = await store.createMultiPool()

        expect(success).toBeFalsy()
        expect(barcode).toEqual('')
        expect(errors).toEqual(mockResponse.errorSummary)
      })
    })

    describe('setMultiPool', () => {
      it('for a new multi pool', async () => {
        const id = 'new'
        const { success } = await store.setMultiPool({ id })
        expect(success).toBeTruthy()
        expect(store.$state.multiPool).toEqual({
          pipeline: 'pacbio',
          pool_method: 'Plate',
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
          1: { id: 1, position: '1', type: 'MultiPoolPosition' },
          2: { id: 2, position: '2', type: 'MultiPoolPosition' },
        }

        const poolA1 = store.getPool(1)
        expect(poolA1).toEqual({ id: 1, position: '1', type: 'MultiPoolPosition' })

        const poolB2 = store.getPool(2)
        expect(poolB2).toEqual({ id: 2, position: '2', type: 'MultiPoolPosition' })
      })

      it('returns null if no pool exists at the given position', () => {
        store.$state.multiPoolPositions = {
          1: { id: 1, position: '1', type: 'MultiPoolPosition' },
        }

        const pool = store.getPool('C3')
        expect(pool).toEqual(null)
      })
    })

    describe('clearData', () => {
      it('clears existing multi pool data', () => {
        const store = useMultiPoolCreateStore()
        store.$state = {
          multiPool: { id: 1, pooling_layout: 'Plate', pipeline: 'Pacbio' },
          multiPoolPositions: {
            1: { id: 1, position: '1' },
            2: { id: 2, position: '2' },
          },
        }

        store.clearData()

        expect(store.$state).toEqual({
          multiPool: {
            pipeline: 'pacbio',
            pool_method: 'Plate',
          },
          multiPoolPositions: {},
        })
      })
    })

    describe('isValidPersisted', () => {
      it('returns false if there is no persisted store', () => {
        localStorage.removeItem('multiPoolCreate')
        expect(store.isValidPersisted('1')).toBeFalsy()
      })

      it('returns true if the persisted store has no id and the requests id is new', () => {
        const persistedData = { multiPool: { pooling_method: 'Plate', pipeline: 'pacbio' } }
        localStorage.setItem('multiPoolCreate', JSON.stringify(persistedData))
        expect(store.isValidPersisted('new')).toBeTruthy()
      })

      it('returns true if the persisted store id matches the requested id', () => {
        const persistedData = {
          multiPool: { id: '1', pooling_method: 'Plate', pipeline: 'pacbio' },
        }
        localStorage.setItem('multiPoolCreate', JSON.stringify(persistedData))
        expect(store.isValidPersisted('1')).toBeTruthy()
      })

      it('returns false if the persisted store id does not match the requested id', () => {
        const persistedData = {
          multiPool: { id: '2', pooling_method: 'Plate', pipeline: 'pacbio' },
        }
        localStorage.setItem('multiPoolCreate', JSON.stringify(persistedData))
        expect(store.isValidPersisted('1')).toBeFalsy()
      })
    })

    describe('updateMultiPoolPosition', () => {
      it('updates the multiPoolPositions with the given position and subPool', () => {
        const position = ''
        // Sub pool is really the state data for pacbioPoolCreateStore
        const subPool = { tubes: {}, plates: {}, resources: {}, selected: {} }

        store.updateMultiPoolPosition({ position, subPool })
        expect(store.multiPoolPositions[position]).toEqual(subPool)
      })
    })

    describe('isValidPool', () => {
      it('returns false if there is no pool at the given position', () => {
        expect(store.isValidPool('1')).toBeFalsy()
      })

      it('returns false if the pool at the given position is invalid', () => {
        const position = '1'
        store.multiPoolPositions[position] = {
          pool: { id: 1, errors: { volume: 'must be present' } },
        }
        expect(store.isValidPool(position)).toBeFalsy()
      })

      it('returns true if the pool at the given position is valid', () => {
        const position = '1'
        store.multiPoolPositions[position] = { pool: { id: 1, errors: {} } }
        expect(store.isValidPool(position)).toBeTruthy()
      })
    })
  })
})
