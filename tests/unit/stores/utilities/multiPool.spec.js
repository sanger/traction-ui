import { payload } from '@/stores/utilities/multiPool.js'

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
})
