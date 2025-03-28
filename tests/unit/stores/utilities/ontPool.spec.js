import { describe, it, expect } from 'vitest'
import { validate, valid, payload, autoTagPlate } from '@/stores/utilities/ontPool.js'

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

  describe('autoTagPlate', () => {
    it('assigns unique tags to libraries on the same plate based on their positions', () => {
      const wells = {
        1: { plate: 1, position: 'A1' },
        2: { plate: 1, position: 'B1' },
        3: { plate: 1, position: 'C1' },
      }
      const requests = {
        1: { id: 1, well: 1 },
        2: { id: 2, well: 2 },
        3: { id: 3, well: 3 },
      }
      const tagSets = {
        1: { tags: [101, 102, 103] },
      }
      const library = { ont_request_id: 1, tag_id: 101 }
      const selectedTagSet = { id: 1 }
      const libraries = {
        1: { ont_request_id: 1, tag_id: 101 },
        2: { ont_request_id: 2 },
        3: { ont_request_id: 3 },
      }

      const result = autoTagPlate({ wells, requests, tagSets, library, selectedTagSet, libraries })
      expect(result[2].tag_id).toBe(102)
      expect(result[3].tag_id).toBe(103)
    })

    it.skip('skips libraries not on the same plate', () => {
      const wells = {
        1: { plate: 1, position: 'A1' },
        2: { plate: 2, position: 'A2' },
      }
      const requests = {
        1: { id: 1, well_id: 1 },
        2: { id: 2, well_id: 2 },
      }
      const tagSets = {
        1: { tags: [101, 102] },
      }
      const library = { ont_request_id: 1, tag_id: 101 }
      const selectedTagSet = { id: 1 }
      const libraries = {
        1: { ont_request_id: 1, tag_id: 101 },
        2: { ont_request_id: 2 },
      }

      const result = autoTagPlate({ wells, requests, tagSets, library, selectedTagSet, libraries })

      expect(result[2]).toBeUndefined()
    })

    it.skip('does not assign tags to libraries with negative or zero offset', () => {
      const wells = {
        1: { plate: 1, position: 'A1' },
        2: { plate: 1, position: 'A1' },
      }
      const requests = {
        1: { id: 1, well_id: 1 },
        2: { id: 2, well_id: 2 },
      }
      const tagSets = {
        1: { tags: [101, 102] },
      }
      const library = { ont_request_id: 1, tag_id: 101 }
      const selectedTagSet = { id: 1 }
      const libraries = {
        1: { ont_request_id: 1, tag_id: 101 },
        2: { ont_request_id: 2 },
      }

      const result = autoTagPlate({ wells, requests, tagSets, library, selectedTagSet, libraries })

      expect(result[2]).toBeUndefined()
    })

    it.skip('wraps around tags when the offset exceeds the tag set length', () => {
      const wells = {
        1: { plate: 1, position: 'A1' },
        2: { plate: 1, position: 'A2' },
        3: { plate: 1, position: 'A3' },
        4: { plate: 1, position: 'A4' },
      }
      const requests = {
        1: { id: 1, well_id: 1 },
        2: { id: 2, well_id: 2 },
        3: { id: 3, well_id: 3 },
        4: { id: 4, well_id: 4 },
      }
      const tagSets = {
        1: { tags: [101, 102, 103] },
      }
      const library = { ont_request_id: 1, tag_id: 101 }
      const selectedTagSet = { id: 1 }
      const libraries = {
        1: { ont_request_id: 1, tag_id: 101 },
        2: { ont_request_id: 2 },
        3: { ont_request_id: 3 },
        4: { ont_request_id: 4 },
      }

      const result = autoTagPlate({ wells, requests, tagSets, library, selectedTagSet, libraries })

      expect(result[2].tag_id).toBe(102)
      expect(result[3].tag_id).toBe(103)
      expect(result[4].tag_id).toBe(101) // Wraps around
    })
  })
})
