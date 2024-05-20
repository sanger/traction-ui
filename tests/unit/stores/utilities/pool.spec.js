import { validate, payload } from '@/stores/utilities/pool'
import { expect, it } from 'vitest'
import { createUsedAliquot } from '@/stores/utilities/usedAliquot.js'

describe('pool', () => {
  describe('createUsedAliquot', () => {
    it('createUsedAliquot with default values', () => {
      const usedAliquot = createUsedAliquot()
      expect(usedAliquot.source_id).toBe(null)
      expect(usedAliquot.template_prep_kit_box_barcode).toBe(null)
      expect(usedAliquot.tag_id).toBe(null)
      expect(usedAliquot.volume).toBe(null)
      expect(usedAliquot.concentration).toBe(null)
      expect(usedAliquot.insert_size).toBe(null)
    })
    it('createUsedAliquot with custom values', () => {
      const usedAliquot = createUsedAliquot({
        source_id: '1',
        template_prep_kit_box_barcode: 'barcode1',
        tag_id: 'tag1',
        volume: 10,
        concentration: 5,
        insert_size: 1,
      })
      expect(usedAliquot.source_id).toBe('1')
      expect(usedAliquot.template_prep_kit_box_barcode).toBe('barcode1')
      expect(usedAliquot.tag_id).toBe('tag1')
      expect(usedAliquot.volume).toBe(10)
      expect(usedAliquot.concentration).toBe(5)
      expect(usedAliquot.insert_size).toBe(1)
    })
  })

  describe('validate', () => {
    it('returns true when all used_aliquots are valid and there are no duplicate tags', () => {
      const used_aliquots = {
        1: createUsedAliquot({
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          template_prep_kit_box_barcode: 'barcode1',
          source_id: '1',
          source_type: 'Pacbio:Request',
        }),
        2: createUsedAliquot({
          tag_id: 'tag2',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          template_prep_kit_box_barcode: 'barcode1',
          source_id: '2',
          source_type: 'Pacbio:Request',
        }),
      }
      // Setup a valid pool so validation doesnt fail on the pool
      const pool = {
        template_prep_kit_box_barcode: 'barcode1',
        volume: 10,
        concentration: 5,
        insert_size: 1,
      }
      expect(validate({ used_aliquots, pool })).toBe(true)
    })

    it('returns false when a library is missing a required attribute', () => {
      const used_aliquots = {
        1: createUsedAliquot({
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          template_prep_kit_box_barcode: 'barcode1',
          source_id: '1',
        }),
        2: createUsedAliquot({
          tag_id: 'tag2',
          volume: 10,
          concentration: 5,
          template_prep_kit_box_barcode: 'barcode1',
        }),
      }

      expect(validate({ used_aliquots, pool: {} })).toBe(false)
      expect(used_aliquots['2'].errors).toEqual({
        insert_size: 'must be present',
        source_id: 'must be present',
        source_type: 'must be present',
      })
    })

    it('returns false when a library volume is less than available volume', () => {
      const used_aliquots = {
        1: createUsedAliquot({
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          template_prep_kit_box_barcode: 'barcode1',
          source_id: '1',
          source_type: 'Pacbio:Request',
          available_volume: 5,
        }),
        2: createUsedAliquot({
          tag_id: 'tag2',
          volume: 10,
          concentration: 5,
          template_prep_kit_box_barcode: 'barcode1',
          insert_size: 1000,
          source_id: '1',
          source_type: 'Pacbio:Request',
        }),
      }

      expect(validate({ used_aliquots, pool: {} })).toBe(false)
      expect(used_aliquots['1'].errors).toEqual({
        volume: 'must be less or equal to available volume',
      })
    })

    it('returns false when there are duplicate tags', () => {
      const used_aliquots = {
        1: createUsedAliquot({
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          template_prep_kit_box_barcode: 'barcode1',
          source_id: '1',
          source_type: 'Pacbio:Request',
        }),
        2: createUsedAliquot({
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          template_prep_kit_box_barcode: 'barcode1',
          source_id: '1',
          source_type: 'Pacbio:Request',
        }),
      }
      expect(validate({ used_aliquots, pool: {} })).toBe(false)
      expect(used_aliquots['2'].errors).toEqual({ tag_id: 'duplicated' })
    })

    it('returns false when the pool has missing fields', () => {
      const pool = {
        insert_size: '',
        concentration: '',
        volume: '',
        template_prep_kit_box_barcode: '',
      }
      expect(validate({ used_aliquots: {}, pool })).toBe(false)
      expect(pool.errors).toEqual({
        insert_size: 'must be present',
        concentration: 'must be present',
        volume: 'must be present',
        template_prep_kit_box_barcode: 'must be present',
      })
    })

    it('returns true when the pool and used_aliquots are valid', () => {
      const used_aliquots = {
        1: createUsedAliquot({
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          template_prep_kit_box_barcode: 'barcode1',
          source_id: '1',
          source_type: 'Pacbio:Request',
        }),
        2: createUsedAliquot({
          tag_id: 'tag2',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          template_prep_kit_box_barcode: 'barcode1',
          source_id: '2',
          source_type: 'Pacbio:Request',
        }),
      }
      const pool = {
        insert_size: 100,
        concentration: 10,
        volume: 10,
        template_prep_kit_box_barcode: 'ABC1',
      }
      validate({ used_aliquots, pool })

      expect(
        Object.values(used_aliquots).every((library) => Object.keys(library.errors).length === 0),
      ).toBeTruthy()
      expect(Object.keys(pool.errors).length).toBe(0)
    })
  })

  describe('payload', () => {
    it('returns a payload object with the correct structure', () => {
      const used_aliquots = {
        1: createUsedAliquot({
          id: '1',
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1,
          source_id: '1',
          template_prep_kit_box_barcode: 'barcode1',
          source_type: 'Pacbio:Request',
        }),
        2: createUsedAliquot({
          id: '2',
          tag_id: 'tag2',
          volume: 10,
          concentration: 5,
          insert_size: 1,
          source_id: '1',
          template_prep_kit_box_barcode: 'barcode1',
          otherUsedAliquotAttribute: 'aliquotValue',
          source_type: 'Pacbio:Request',
        }),
      }
      const pool = {
        id: '1',
        template_prep_kit_box_barcode: 'barcode1',
        volume: 10,
        concentration: 5,
        insert_size: 1,
        otherPoolAttribute: 'poolValue',
      }

      const expected = {
        data: {
          type: 'pools',
          id: '1',
          attributes: {
            used_aliquots_attributes: [
              {
                id: '1',
                volume: 10,
                concentration: 5,
                insert_size: 1,
                source_id: '1',
                source_type: 'Pacbio:Request',
                tag_id: 'tag1',
                template_prep_kit_box_barcode: 'barcode1',
              },
              {
                id: '2',
                volume: 10,
                concentration: 5,
                insert_size: 1,
                source_id: '1',
                source_type: 'Pacbio:Request',
                tag_id: 'tag2',
                template_prep_kit_box_barcode: 'barcode1',
              },
            ],
            primary_aliquot_attributes: {
              template_prep_kit_box_barcode: 'barcode1',
              volume: 10,
              concentration: 5,
              insert_size: 1,
            },
            template_prep_kit_box_barcode: 'barcode1',
            volume: 10,
            concentration: 5,
            insert_size: 1,
          },
        },
      }

      const result = payload({ used_aliquots, pool })

      expect(result).toEqual(expected)
    })
  })
})
