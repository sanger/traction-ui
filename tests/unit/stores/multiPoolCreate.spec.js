import { useMultiPoolCreateStore } from '@/stores/multiPoolCreate.js'
import { successfulResponse, failedResponse } from '@support/testHelper.js'
import { beforeEach, describe, it } from 'vitest'
import { payload } from '@/stores/utilities/multiPool.js'
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
          data: payload({ multiPool: store.multiPool }),
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

      it('returns an empty object if no pool exists at the given position', () => {
        store.$state.multiPoolPositions = {
          1: { id: 1, position: '1', type: 'MultiPoolPosition' },
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

    describe('parsePoolingCsvFile', () => {
      let file, fileTextContent

      beforeEach(() => {
        file = {
          text: () => Promise.resolve(fileTextContent),
        }
      })

      it('returns an error if no file is provided', async () => {
        const { success, errors } = await store.parsePoolingCsvFile()
        expect(success).toBeFalsy()
        expect(errors).toEqual('file is required')
      })

      it('returns an error if the file is not a valid multi pool csv', async () => {
        fileTextContent = 'Pool Number,Source Identifier\n1,\n2,Sample2'
        const { success, errors } = await store.parsePoolingCsvFile(file)
        expect(success).toBeFalsy()
        expect(errors).toContain('Missing source identifier on line 2')
      })
    })
  })
})
