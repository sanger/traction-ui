import { createUsedAliquot, validate, payload } from '@/stores/utilities/pool'
import { expect, it } from 'vitest'

describe('pool', () => {
  it('createUsedAliquot', () => {
    expect(createUsedAliquot()).toEqual({
      source_id: null,
      template_prep_kit_box_barcode: null,
      tag_id: null,
      volume: null,
      concentration: null,
      insert_size: null,
    })
  })
  describe('validate', () => {
    it('returns true when all used_aliquots are valid and there are no duplicate tags', () => {
      const used_aliquots = {
        1: {
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          source_id: '1',
        },
        2: {
          tag_id: 'tag2',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          source_id: '2',
        },
      }
      const result = validate(used_aliquots)
      expect(result).toBe(true)
    })

    it('returns false when a library is missing a required attribute', () => {
      const used_aliquots = {
        1: {
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          source_id: '1',
        },
        2: { tag_id: 'tag2', volume: 10, concentration: 5 },
      }

      const result = validate(used_aliquots)

      expect(result).toBe(false)
      expect(used_aliquots['2'].errors).toEqual({
        insert_size: 'must be present',
        source_id: 'must be present',
      })
    })

    it('returns false when there are duplicate tags', () => {
      const used_aliquots = {
        1: {
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          source_id: '1',
        },
        2: {
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1000,
          source_id: '1',
        },
      }
      const result = validate(used_aliquots)
      expect(result).toBe(false)
      expect(used_aliquots['2'].errors).toEqual({ tag_id: 'duplicated' })
    })
  })

  describe('payload', () => {
    it('returns a payload object with the correct structure', () => {
      const used_aliquots = {
        1: {
          id: '1',
          tag_id: 'tag1',
          volume: 10,
          concentration: 5,
          insert_size: 1,
          source_id: '1',
          template_prep_kit_box_barcode: 'barcode1',
        },
        2: {
          id: '2',
          tag_id: 'tag2',
          volume: 10,
          concentration: 5,
          insert_size: 1,
          source_id: '1',
          template_prep_kit_box_barcode: 'barcode1',
          otherUsedAliquotAttribute: 'aliquotValue',
        },
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
                tag_id: 'tag1',
                template_prep_kit_box_barcode: 'barcode1',
              },
              {
                id: '2',
                volume: 10,
                concentration: 5,
                insert_size: 1,
                source_id: '1',
                tag_id: 'tag2',
                template_prep_kit_box_barcode: 'barcode1',
              },
            ],
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
