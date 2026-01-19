import { describe, it, expect } from 'vitest'
import { createSubPools } from '@/stores/utilities/multiPool.js'
// import { dataToObjectById } from '@/api/JsonApi.js'

describe('multiPool utilities', () => {
  describe('createSubPools', () => {
    const multiPool = { id: 1, type: 'multi_pools', multi_pool_positions: ['10', '20'] }
    const resources = {
      multiPoolPositions: {
        10: { id: '10', type: 'multi_pool_positions', pool_id: '100', position: 'A1' },
        20: { id: '20', type: 'multi_pool_positions', pool_id: '200', position: 'B1' },
      },
      pools: {
        100: { id: '100', type: 'pool', barcode: 'TRAC-2-100' },
        200: { id: '200', type: 'pool', barcode: 'TRAC-2-200' },
      },
    }
    it('creates sub-pools correctly', () => {
      const subPools = createSubPools({ multiPool, ...resources })
      expect(subPools).toEqual([
        { id: '100', barcode: 'TRAC-2-100', position: 'A1' },
        { id: '200', barcode: 'TRAC-2-200', position: 'B1' },
      ])
    })
    it('if the multi-pool is empty', () => {
      const subPools = createSubPools({ multiPool: {}, ...resources })
      expect(subPools).toEqual([])
    })
  })
})
