import { expect, it } from 'vitest'
import {
  validateAndFormatAsPayloadData,
  hasDuplicateTags,
} from '@/stores/utilities/pacbioLibraryBatches'
import fs from 'fs'
import PacbioRequestsFactory from '@tests/factories/PacbioRequestsFactory.js'
import PacbioTagSetFactory from '@tests/factories/PacbioTagSetFactory.js'

const pacbioRequestsFactory = PacbioRequestsFactory()
const pacbioTagSetFactory = PacbioTagSetFactory()

describe('pacbioLibraryBatches', () => {
  const requests = pacbioRequestsFactory.storeData.requests
  const tags = Object.values(pacbioTagSetFactory.storeData.tags)

  describe('validateAndFormatAsPayloadData', () => {
    const requiredFields = [
      'source',
      'tag',
      'concentration',
      'insert_size',
      'volume',
      'template_prep_kit_box_barcode',
    ]

    requiredFields.forEach((field) => {
      it(`returns an error if ${field} is missing`, () => {
        const record = {
          source: 'sample1',
          tag: '1',
          concentration: 10,
          insert_size: 100,
          volume: 5,
          template_prep_kit_box_barcode: 'abc',
        }
        record[field] = '' // Set the current field to an empty string
        const info = { lines: 1 }
        const result = validateAndFormatAsPayloadData({ record, info }, requests, tags)
        expect(result).toEqual(new Error(`Invalid record at line 1: ${field} is required`))
      })
    })

    it('returns an error if source is not found in requests', () => {
      const record = {
        source: 'sample3',
        tag: '1',
        tag_set: 'tagSet1',
        concentration: 10,
        insert_size: 100,
        volume: 5,
        template_prep_kit_box_barcode: 'abc',
      }
      const info = { lines: 1 }
      const result = validateAndFormatAsPayloadData({ record, info }, requests, tags)
      expect(result).toEqual(new Error('Invalid record at line 1: source sample3 not found'))
    })

    it('returns an error if tag is not found in tagIds', () => {
      const record = {
        source: requests[0].source_identifier,
        tag_set: pacbioTagSetFactory.storeData.selected.tagSet.name,
        tag: '3',
        concentration: 10,
        insert_size: 100,
        volume: 5,
        template_prep_kit_box_barcode: 'abc',
      }
      const info = { lines: 1 }
      const result = validateAndFormatAsPayloadData({ record, info }, requests, tags)
      expect(result).toEqual(new Error('Invalid record at line 1: tag 3 not found'))
    })

    it('returns formatted payload data if all validations pass', () => {
      const tagSet = pacbioTagSetFactory.storeData.selected.tagSet
      const tag = pacbioTagSetFactory.storeData.selected.tag
      const request = pacbioRequestsFactory.content.data[0]
      const record = {
        source: request.attributes.source_identifier,
        tag_set: tagSet.name,
        tag: tag.group_id,
        concentration: 10,
        insert_size: 100,
        volume: 5,
        template_prep_kit_box_barcode: 'abc',
      }
      const info = { lines: 1 }
      const result = validateAndFormatAsPayloadData({ record, info }, requests, tags)
      expect(result).toEqual({
        pacbio_request_id: request.id,
        tag_id: tag.id,
        concentration: 10,
        insert_size: 100,
        volume: 5,
        template_prep_kit_box_barcode: 'abc',
        primary_aliquot_attributes: {
          tag_id: tag.id,
          template_prep_kit_box_barcode: 'abc',
          concentration: 10,
          insert_size: 100,
          volume: 5,
        },
      })
    })
  })

  describe('hasDuplicateTags', () => {
    it('returns when there are no duplicate sources', () => {
      const csvText = fs.readFileSync('./tests/data/csv/pacbio_library_batch.csv', 'utf8')
      const result = hasDuplicateTags(csvText)
      expect(result).toBe(undefined)
    })

    it('returns error when there are duplicate tags', () => {
      const csvText = fs.readFileSync(
        './tests/data/csv/pacbio_library_batch_duplicate_tags.csv',
        'utf8',
      )
      const result = hasDuplicateTags(csvText)
      expect(result).toBe('Duplicate tag: bc2067')
    })

    it('returns when there is only one tag', () => {
      const csvText = `Source,Tag,Template prep kit box barcode,Volume,Concentration,Insert Size
  sample_DN814327C_A1,289,035980102141700123124,10,13.16,10191`
      const result = hasDuplicateTags(csvText)
      expect(result).toBe(undefined)
    })
    it('returns error when tag is empty', () => {
      const csvText = `Source,Tag,Template prep kit box barcode,Volume,Concentration,Insert Size
  sample_DN814327C_A1,,035980102141700123124,10,13.16,10191
  sample_DN814327C_A1,,035980102141700123124,10,13.16,10191`
      const result = hasDuplicateTags(csvText)
      expect(result).toBe(
        'Tag missing in line: sample_DN814327C_A1,,035980102141700123124,10,13.16,10191',
      )
    })
    it('returns error when there is invalid tag', () => {
      const csvText = `Source,Tag,Template prep kit box barcode,Volume,Concentration,Insert Size
  sample_DN814327C_A1
  sample_DN814327C_A1,,035980102141700123124,10,13.16,10191`
      const result = hasDuplicateTags(csvText)
      expect(result).toBe('Tag missing in line: sample_DN814327C_A1')
    })
  })
})
