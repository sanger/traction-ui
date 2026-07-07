import { useMultiPoolCreateStore } from '@/stores/multiPoolCreate.js'
import { usePacbioPoolCreateStore } from '@/stores/pacbioPoolCreate.js'
import { successfulResponse, failedResponse } from '@support/testHelper.js'
import { beforeEach, describe, it } from 'vitest'
import { requiredHeaders } from '@/lib/csv/multiPool.js'
import { multiPoolPayload } from '@/stores/utilities/multiPool.js'
import MultiPoolFactory from '@tests/factories/MultiPoolFactory.js'
import useRootStore from '@/stores'

describe('useMultiPoolCreateStore', () => {
  let store, pacbioPoolCreateStore

  beforeEach(() => {
    store = useMultiPoolCreateStore()
    pacbioPoolCreateStore = usePacbioPoolCreateStore()
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
          data: { id: '1' },
        })
        store.multiPool = { pooling_method: 'Plate', pipeline: 'pacbio' }
        create.mockResolvedValue(mockResponse)

        const { success, id, errors } = await store.createMultiPool()

        expect(success).toBeTruthy()
        expect(create).toHaveBeenCalledWith({
          data: multiPoolPayload({
            multiPool: store.multiPool,
            multiPoolPositions: store.multiPoolPositions,
          }),
        })
        expect(id).toEqual('1')
        expect(errors).toEqual(undefined)
      })

      it('handles failure', async () => {
        const mockResponse = failedResponse(422)
        create.mockResolvedValue(mockResponse)

        const { success, id, errors } = await store.createMultiPool()

        expect(success).toBeFalsy()
        expect(id).toEqual('')
        expect(errors).toEqual(mockResponse.errorSummary)
      })
    })

    describe('setMultiPool', () => {
      it('for a new multi pool', async () => {
        const id = 'new'
        store.fetchMultiPool = vi.fn()
        const { success } = await store.setMultiPool({ id })
        expect(success).toBeTruthy()
        expect(store.$state.multiPool).toEqual({
          pipeline: 'pacbio',
          pool_method: 'Plate',
        })
        // We don't call the service if its a new multi pool because there is no id to fetch
        expect(store.fetchMultiPool).not.toHaveBeenCalled()
      })

      it('for a multi pool with a bad id', async () => {
        const id = 'badid'
        store.fetchMultiPool = vi.fn().mockResolvedValue({ success: false })
        const { success } = await store.setMultiPool({ id })
        // We still expect it to call the service with the bad id to attempt to fetch the multi pool, even though it will fail
        expect(store.fetchMultiPool).toHaveBeenCalledWith(id)
        expect(success).toBeFalsy()
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

      it('returns an error if the file is not a valid multi pool csv (missing header)', async () => {
        fileTextContent = 'Pool Number,Source Identifier\n1,\n2,Sample2'
        const { success, errors } = await store.parsePoolingCsvFile(file)
        expect(success).toBeFalsy()
        expect(errors).toContain('Header "Tag Set" not found in CSV')
      })

      it('parses a valid multi pool csv file and builds the multi pool positions', async () => {
        pacbioPoolCreateStore.buildPoolFromMultiPoolCsvRecords = vi
          .fn()
          .mockResolvedValue({ success: true, errors: [] })
        fileTextContent = `${requiredHeaders.join(',')}\n`
        fileTextContent += '1,Sample1,Set1,Tag1,Barcode1,10,20,500\n'
        fileTextContent += '1,Sample2,Set1,Tag2,Barcode2,15,25,600\n'

        const { success, errors } = await store.parsePoolingCsvFile(file)
        expect(success).toBeTruthy()
        expect(errors).toEqual([])
      })

      it('returns errors from building the pools if the csv file is valid but there is an error building the pools', async () => {
        pacbioPoolCreateStore.buildPoolFromMultiPoolCsvRecords = vi
          .fn()
          .mockResolvedValue({ success: false, errors: ['Error building pool'] })
        fileTextContent = `${requiredHeaders.join(',')}\n`
        fileTextContent += '1,Sample1,Set1,Tag1,Barcode1,10,20,500\n'
        fileTextContent += '1,Sample2,Set1,Tag2,Barcode2,15,25,600\n'

        const { success, errors } = await store.parsePoolingCsvFile(file)
        expect(success).toBeFalsy()
        expect(errors).toEqual(['Error building pool number 1: Error building pool'])
        expect(store.multiPoolPositions).toEqual({})
      })

      it('validates all pools and returns combined errors across multiple pools', async () => {
        pacbioPoolCreateStore.buildPoolFromMultiPoolCsvRecords = vi.fn()
        pacbioPoolCreateStore.buildPoolFromMultiPoolCsvRecords.mockResolvedValueOnce({
          success: false,
          errors: ['Pool 1 failed'],
        })
        pacbioPoolCreateStore.buildPoolFromMultiPoolCsvRecords.mockResolvedValueOnce({
          success: true,
          errors: [],
        })
        pacbioPoolCreateStore.buildPoolFromMultiPoolCsvRecords.mockResolvedValueOnce({
          success: false,
          errors: ['Pool 3 issue A', 'Pool 3 issue B'],
        })

        fileTextContent = `${requiredHeaders.join(',')}\n`
        fileTextContent += '1,Sample1,Set1,Tag1,Barcode1,10,20,500\n'
        fileTextContent += '2,Sample2,Set1,Tag2,Barcode2,10,20,500\n'
        // Add a valid pool to ensure valid pools are processed but not included in the error results
        // and not stored in multiPoolPositions since the first two pools failed to build
        fileTextContent += '3,Sample3,Set1,Tag3,Barcode3,10,20,500\n'

        const { success, errors } = await store.parsePoolingCsvFile(file)

        expect(success).toBeFalsy()
        expect(errors).toEqual([
          'Error building pool number 1: Pool 1 failed',
          'Error building pool number 3: Pool 3 issue A',
          'Error building pool number 3: Pool 3 issue B',
        ])
        expect(pacbioPoolCreateStore.buildPoolFromMultiPoolCsvRecords).toHaveBeenCalledTimes(3)
        expect(store.multiPoolPositions).toEqual({})
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

      it('returns false if the persisted store has no id and the requested id is not new', () => {
        const persistedData = { multiPool: { pooling_method: 'Plate', pipeline: 'pacbio' } }
        localStorage.setItem('multiPoolCreate', JSON.stringify(persistedData))
        expect(store.isValidPersisted('randomstring')).toBeFalsy()
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

    describe('isValidMultiPool', () => {
      it('returns false if there are no pool positions', () => {
        store.multiPoolPositions = {}
        expect(store.isValidMultiPool()).toBeFalsy()
      })

      it('returns false if any pool position is invalid', () => {
        store.multiPoolPositions = {
          1: { pool: { id: 1, errors: {} } },
          2: { pool: { id: 2, errors: { volume: 'must be present' } } },
        }
        expect(store.isValidMultiPool()).toBeFalsy()
      })

      it('returns true if all pool positions are valid', () => {
        store.multiPoolPositions = {
          1: { pool: { id: 1, errors: {} } },
          2: { pool: { id: 2, errors: {} } },
        }
        expect(store.isValidMultiPool()).toBeTruthy()
      })
    })
  })
})
