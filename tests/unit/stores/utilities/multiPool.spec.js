import { createSubPools, payload } from '@/stores/utilities/multiPool.js'

describe('multiPool', () => {
  describe('payload', () => {
    it('returns a payload object with the correct structure', () => {
      const multiPool = {
        id: '1',
        pipeline: 'pacbio',
        pool_method: 'Plate',
      }

      const expected = {
        data: {
          type: 'multi_pools',
          id: '1',
          attributes: {
            pipeline: multiPool.pipeline,
            pool_method: multiPool.pool_method,
          },
        },
      }

      const result = payload({ multiPool })

      expect(result).toEqual(expected)
    })
  })

  describe('createSubPools', () => {
    const multiPool = { id: 1, type: 'multi_pools', multi_pool_positions: ['10', '20'] }
    const resources = {
      multiPoolPositions: {
        10: { id: '10', type: 'multi_pool_positions', pool_id: '100', position: '10' },
        20: { id: '20', type: 'multi_pool_positions', pool_id: '200', position: '20' },
      },
      pools: {
        100: { id: '100', type: 'pool', barcode: 'TRAC-2-100' },
        200: { id: '200', type: 'pool', barcode: 'TRAC-2-200' },
      },
    }
    it('creates sub-pools correctly', () => {
      const subPools = createSubPools({ multiPool, ...resources })
      expect(subPools).toEqual([
        { id: '100', barcode: 'TRAC-2-100', position: '10' },
        { id: '200', barcode: 'TRAC-2-200', position: '20' },
      ])
    })
    it('if the multi-pool is empty', () => {
      const subPools = createSubPools({ multiPool: {}, ...resources })
      expect(subPools).toEqual([])
    })
  })
})
