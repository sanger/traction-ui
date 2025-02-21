import { describe, it, expect } from 'vitest'
import { validate, valid, payload } from '@/stores/utilities/ontPool.js'

describe('ontPool.js', () => {
  describe('validate', () => {
    it('validates libraries and adds errors if required fields are missing', () => {
      const libraries = {
        lib1: { ont_request_id: 1, volume: 10, concentration: 20, insert_size: 300 },
        lib2: { ont_request_id: 2, volume: 15, concentration: 25, insert_size: 350, tag_id: 1 },
      }
      validate({ libraries })
      expect(libraries.lib1.errors).toEqual({ tag_id: 'must be present' })
      expect(libraries.lib2.errors).toEqual({})
    })

    it('validates libraries and adds errors if tags are duplicated', () => {
      const libraries = {
        lib1: { ont_request_id: 1, volume: 10, concentration: 20, insert_size: 300, tag_id: 1 },
        lib2: { ont_request_id: 2, volume: 15, concentration: 25, insert_size: 350, tag_id: 1 },
      }
      validate({ libraries })
      expect(libraries.lib1.errors).toEqual({ tag_id: 'duplicated' })
      expect(libraries.lib2.errors).toEqual({ tag_id: 'duplicated' })
    })
  })

  describe('valid', () => {
    it('returns true if all libraries are valid', () => {
      const libraries = {
        lib1: { errors: {} },
        lib2: { errors: {} },
      }
      expect(valid({ libraries })).toBe(true)
    })

    it('returns false if any library has errors', () => {
      const libraries = {
        lib1: { errors: {} },
        lib2: { errors: { tag_id: 'duplicated' } },
      }
      expect(valid({ libraries })).toBe(false)
    })
  })

  describe('payload', () => {
    it('creates a JSON API compliant payload', () => {
      const libraries = {
        lib1: {
          id: 1,
          ont_request_id: 2,
          kit_barcode: 'ABC123',
          tag_id: 3,
          volume: 10,
          concentration: 20,
          insert_size: 300,
        },
        lib2: {
          id: 2,
          ont_request_id: 3,
          kit_barcode: 'DEF456',
          tag_id: 4,
          volume: 15,
          concentration: 25,
          insert_size: 350,
        },
      }
      const pool = {
        id: 1,
        kit_barcode: 'XYZ789',
        volume: 20,
        concentration: 30,
        insert_size: 400,
      }
      const result = payload({ libraries, pool })
      expect(result).toEqual({
        data: {
          type: 'pools',
          id: 1,
          attributes: {
            library_attributes: [
              {
                id: 1,
                ont_request_id: 2,
                kit_barcode: 'ABC123',
                tag_id: 3,
                volume: 10,
                concentration: 20,
                insert_size: 300,
              },
              {
                id: 2,
                ont_request_id: 3,
                kit_barcode: 'DEF456',
                tag_id: 4,
                volume: 15,
                concentration: 25,
                insert_size: 350,
              },
            ],
            kit_barcode: 'XYZ789',
            volume: 20,
            concentration: 30,
            insert_size: 400,
          },
        },
      })
    })
  })
})
