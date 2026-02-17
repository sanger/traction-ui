import {
  createSubPools,
  multiPoolPayload,
  multiPoolPositionsToAttributes,
} from '@/stores/utilities/multiPool.js'
import { createUsedAliquot } from '@/stores/utilities/usedAliquot.js'

describe('multiPool', () => {
  describe('multiPoolPayload', () => {
    it('returns a payload object with the correct structure for a new pool', () => {
      const multiPool = {
        id: '1',
        pipeline: 'pacbio',
        pool_method: 'Plate',
      }
      const used_aliquots = {
        1: createUsedAliquot({
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          source_id: '1',
          source_type: 'Pacbio::Library',
        }),
        2: createUsedAliquot({
          volume: 20,
          concentration: 10,
          insert_size: 2000,
          source_id: '2',
          source_type: 'Pacbio::Library',
        }),
      }
      const multiPoolPositions = {
        10: {
          used_aliquots: used_aliquots,
          pool: {
            volume: 30,
            concentration: 15,
            insert_size: 1500,
            template_prep_kit_box_barcode: 'TRAC-TPK-1',
          },
        },
      }

      const expected = {
        data: {
          type: 'multi_pools',
          id: '1',
          attributes: {
            pipeline: multiPool.pipeline,
            pool_method: multiPool.pool_method,
            multi_pool_positions_attributes: [
              {
                position: '10',
                pacbio_pool_attributes: {
                  used_aliquots_attributes: [
                    used_aliquots[1].payloadAttributes(),
                    used_aliquots[2].payloadAttributes(),
                  ],
                  primary_aliquot_attributes: {
                    template_prep_kit_box_barcode: 'TRAC-TPK-1',
                    volume: 30,
                    concentration: 15,
                    insert_size: 1500,
                  },
                  template_prep_kit_box_barcode: 'TRAC-TPK-1',
                  volume: 30,
                  concentration: 15,
                  insert_size: 1500,
                },
              },
            ],
          },
        },
      }

      const result = multiPoolPayload({ multiPool, multiPoolPositions })

      expect(result).toEqual(expected)
    })
  })

  describe('multiPoolPositionsToAttributes', () => {
    it('converts multiPoolPositions to the correct array format', () => {
      const multiPoolPositions = {
        10: {
          used_aliquots: {
            1: {
              volume: 10,
              concentration: 5,
              insert_size: 1000,
              source_id: '1',
              source_type: 'Pacbio::Library',
            },
          },
          pool: {
            volume: 30,
            concentration: 15,
            insert_size: 1500,
            template_prep_kit_box_barcode: 'TRAC-TPK-1',
          },
        },
      }

      const expected = [
        {
          position: '10',
          pacbio_pool_attributes: {
            used_aliquots_attributes: [
              createUsedAliquot({
                volume: 10,
                concentration: 5,
                insert_size: 1000,
                source_id: '1',
                source_type: 'Pacbio::Library',
              }).payloadAttributes(),
            ],
            primary_aliquot_attributes: {
              template_prep_kit_box_barcode: 'TRAC-TPK-1',
              volume: 30,
              concentration: 15,
              insert_size: 1500,
            },
            template_prep_kit_box_barcode: 'TRAC-TPK-1',
            volume: 30,
            concentration: 15,
            insert_size: 1500,
          },
        },
      ]

      const result = multiPoolPositionsToAttributes(multiPoolPositions)

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
