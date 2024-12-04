import { expect, it } from 'vitest'
import {
  validateAndFormatAsPayloadData,
  fetchTagsAndRequests,
} from '@/stores/utilities/pacbioLibraryBatches'
import PacbioRequestFactory from '@tests/factories/PacbioRequestFactory.js'
import PacbioTagSetFactory from '@tests/factories/PacbioTagSetFactory.js'
import { createPinia, setActivePinia } from '@support/testHelper.js'
import useRootStore from '@/stores'

const pacbioRequestFactory = PacbioRequestFactory()
const pacbioTagSetFactory = PacbioTagSetFactory()

describe('pacbioLibraryBatches', () => {
  const requests = pacbioRequestFactory.storeData.requests
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
          tag: 'abc',
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
        tag: tags[0].group_id,
        concentration: 10,
        insert_size: 100,
        volume: 5,
        template_prep_kit_box_barcode: 'abc',
      }
      const info = { lines: 1 }
      const result = validateAndFormatAsPayloadData({ record, info }, requests, tags)
      expect(result).toEqual(new Error('Invalid record at line 1: source sample3 not found'))
    })

    it('returns an error if tag is not found in tags', () => {
      const record = {
        source: requests[0].source_identifier,
        tag: 'abc',
        concentration: 10,
        insert_size: 100,
        volume: 5,
        template_prep_kit_box_barcode: 'abc',
      }
      const info = { lines: 1 }
      const result = validateAndFormatAsPayloadData({ record, info }, requests, tags)
      expect(result).toEqual(new Error('Invalid record at line 1: tag abc not found'))
    })
    it('returns an error if tag is duplicated', () => {
      const tagWithDuplicates = [...tags, tags[0]]

      const record = {
        source: requests[0].source_identifier,
        tag: tags[0].group_id,
        concentration: 10,
        insert_size: 100,
        volume: 5,
        template_prep_kit_box_barcode: 'abc',
      }
      const info = { lines: 1 }
      const result = validateAndFormatAsPayloadData({ record, info }, requests, tagWithDuplicates)
      expect(result).toEqual(
        new Error(`Invalid record at line 1: Duplicate tag: ${tags[0].group_id}`),
      )
    })

    it('returns formatted payload data if all validations pass', () => {
      const tagSet = pacbioTagSetFactory.storeData.selected.tagSet
      const tag = pacbioTagSetFactory.storeData.selected.tag
      const request = pacbioRequestFactory.content.data[0]
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

  describe('fetchTagsAndRequests', () => {
    let tagSet, rootStore, requestsData, sources
    beforeEach(() => {
      const pinia = createPinia()
      setActivePinia(pinia)
      rootStore = useRootStore()
      rootStore.api.v2 = {
        traction: {
          pacbio: {
            tag_sets: { get: vi.fn().mockResolvedValue(pacbioTagSetFactory.responses.fetch) },
            requests: { get: vi.fn().mockResolvedValue(pacbioRequestFactory.responses.fetch) },
          },
        },
      }
      tagSet = pacbioTagSetFactory.storeData.selected.tagSet
      requestsData = pacbioRequestFactory.storeData.requests
      sources = requestsData.map((r) => r.source_identifier)
    })

    it('fetches requests and tags successfully', async () => {
      const { requests, tags } = await fetchTagsAndRequests(sources, tagSet)

      expect(rootStore.api.v2.traction.pacbio.requests.get).toHaveBeenCalledWith({
        filter: { source_identifier: sources.join(',') },
      })
      expect(rootStore.api.v2.traction.pacbio.tag_sets.get).toHaveBeenCalledWith({
        include: 'tags',
        filter: { name: tagSet.name },
      })
      expect(requests).toEqual(pacbioRequestFactory.storeData.requests)
      expect(tags).toEqual(Object.values(pacbioTagSetFactory.storeData.tags))
    })

    it('returns null tags if tag set fetch fails', async () => {
      rootStore.api.v2.traction.pacbio.tag_sets.get.mockResolvedValue({ success: false })

      const { requests, tags } = await fetchTagsAndRequests(sources, tagSet)

      expect(rootStore.api.v2.traction.pacbio.requests.get).toHaveBeenCalledWith({
        filter: { source_identifier: sources.join(',') },
      })
      expect(rootStore.api.v2.traction.pacbio.tag_sets.get).toHaveBeenCalledWith({
        include: 'tags',
        filter: { name: tagSet.name },
      })
      expect(requests).toEqual(pacbioRequestFactory.storeData.requests)
      expect(tags).toBeUndefined()
    })

    it('returns empty requests if request fetch fails', async () => {
      rootStore.api.v2.traction.pacbio.requests.get.mockResolvedValue({ success: false })

      const { requests } = await fetchTagsAndRequests(sources, tagSet)

      expect(rootStore.api.v2.traction.pacbio.requests.get).toHaveBeenCalledWith({
        filter: { source_identifier: sources.join(',') },
      })
      expect(rootStore.api.v2.traction.pacbio.tag_sets.get).toHaveBeenCalledWith({
        include: 'tags',
        filter: { name: tagSet.name },
      })
      expect(requests).toBeUndefined()
    })
  })
})
