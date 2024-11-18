import { expect, it } from 'vitest'
import { validateAndFormatAsPayloadData } from '@/stores/utilities/pacbioLibraryBatches'

describe('pacbioLibraryBatches', () => {
  describe('validateAndFormatAsPayloadData', () => {
    const requests = [
      { id: 1, sample_name: 'sample1' },
      { id: 2, sample_name: 'sample2' },
    ]
    const tagIds = ['1', '2']

    it('returns an error if source or tag is missing', () => {
      const record = { source: '', tag: '', concentration: 10, insert_size: 100, volume: 5 }
      const info = { lines: 1 }
      const result = validateAndFormatAsPayloadData({ record, info }, requests, tagIds)
      expect(result).toEqual(new Error('Invalid record at line 1: source and tag are required'))
    })

    it('returns an error if source is not found in requests', () => {
      const record = {
        source: 'sample3',
        tag: '1',
        concentration: 10,
        insert_size: 100,
        volume: 5,
      }
      const info = { lines: 1 }
      const result = validateAndFormatAsPayloadData({ record, info }, requests, tagIds)
      expect(result).toEqual(new Error('Invalid record at line 1: source sample3 not found'))
    })

    it('returns an error if tag is not found in tagIds', () => {
      const record = {
        source: 'sample1',
        tag: '3',
        concentration: 10,
        insert_size: 100,
        volume: 5,
      }
      const info = { lines: 1 }
      const result = validateAndFormatAsPayloadData({ record, info }, requests, tagIds)
      expect(result).toEqual(new Error('Invalid record at line 1: tag 3 not found'))
    })

    it('returns an error if any required attribute is missing', () => {
      const record = {
        source: 'sample1',
        tag: '1',
        concentration: 10,
        insert_size: 100,
        template_prep_kit_box_barcode: 'abc',
      }
      const info = { lines: 1 }
      const result = validateAndFormatAsPayloadData({ record, info }, requests, tagIds)
      expect(result).toEqual(new Error('Invalid record at line 1: volume is required'))
    })

    it('returns formatted payload data if all validations pass', () => {
      const record = {
        source: 'sample1',
        tag: '1',
        concentration: 10,
        insert_size: 100,
        volume: 5,
        template_prep_kit_box_barcode: 'abc',
      }
      const info = { lines: 1 }
      const result = validateAndFormatAsPayloadData({ record, info }, requests, tagIds)
      expect(result).toEqual({
        pacbio_request_id: 1,
        tag_id: '1',
        concentration: 10,
        insert_size: 100,
        volume: 5,
        template_prep_kit_box_barcode: 'abc',
        primary_aliquot_attributes: {
          tag_id: '1',
          template_prep_kit_box_barcode: 'abc',
          concentration: 10,
          insert_size: 100,
          volume: 5,
        },
      })
    })
  })
})
