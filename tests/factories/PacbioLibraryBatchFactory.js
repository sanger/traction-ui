import BaseFactory from './BaseFactory'
import { dataToObjectById, groupIncludedByResource } from './../../src/api/JsonApi.js'

const PacbioLibraryBatchFactory = (tags = []) => {
  const data = {
    data: [
      {
        id: '1',
        type: 'library_batches',
        links: {
          self: 'http://localhost:3100/v1/pacbio/library_batches/1',
        },
        attributes: {
          created_at: '2024-11-15T16:55:48.480Z',
        },
        relationships: {
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/library_batches/1/relationships/libraries',
              related: 'http://localhost:3100/v1/pacbio/library_batches/1/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '11',
              },
              {
                type: 'libraries',
                id: '12',
              },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '21',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/pacbio/libraries/24',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 10,
          concentration: 13.16,
          template_prep_kit_box_barcode: '035980102141700123124',
          insert_size: 10191,
          created_at: '2024/11/15 17:38',
          deactivated_at: null,
          sample_name: '2STDY97',
          source_identifier: 'GEN-1725896371-4:B3',
          pacbio_request_id: 407,
          tag_id: 303,
          used_volume: 0,
          available_volume: 10,
          barcode: 'TRAC-2-121',
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/24/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/libraries/24/tube',
            },
            data: {
              type: 'tubes',
              id: '121',
            },
          },
        },
      },
      {
        id: '12',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/pacbio/libraries/24',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 10,
          concentration: 13.16,
          template_prep_kit_box_barcode: '035980102141700123124',
          insert_size: 10191,
          created_at: '2024/11/15 17:38',
          deactivated_at: null,
          sample_name: '5049STDY8152830',
          source_identifier: 'DN814327C:A1',
          pacbio_request_id: 407,
          tag_id: 304,
          used_volume: 0,
          available_volume: 10,
          barcode: 'TRAC-2-122',
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/24/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/libraries/24/tube',
            },
            data: {
              type: 'tubes',
              id: '122',
            },
          },
        },
      },
    ],
    meta: {
      page_count: 1,
    },
  }

  const createStoreData = ({ included }) => {
    const { libraries } = groupIncludedByResource(included)
    const librariesObj = dataToObjectById({ data: libraries, includeRelationships: true })
    return {
      librariesInBatch: Object.values(librariesObj).map((library) => {
        return {
          source: library.source_identifier,
          id: library.id,
          barcode: library.barcode,
          tag: tags[library.tag_id]?.group_id,
          volume: library.volume,
          concentration: library.concentration,
          insert_size: library.insert_size,
          template_prep_kit_box_barcode: library.template_prep_kit_box_barcode,
        }
      }),
      libraries: librariesObj,
      librariesArray: Object.values(librariesObj),
    }
  }

  const storeData = createStoreData(data)

  const createCsvFromLibraryBatchData = (tags, invalid_source = false, duplicate_tags = false) => {
    const tagArrr = Object.values(tags)
    const header = [
      'sample_name',
      'tag',
      'template_prep_kit_box_barcode',
      'volume',
      'concentration',
      'insert_size',
    ]
    const lines = []
    Object.values(storeData.libraries).forEach((library, indx) => {
      let tag =
        duplicate_tags && indx > 0
          ? lines[0].split(',')[1]
          : tagArrr.find((t) => t.id === String(library.tag_id))?.group_id
      const sample_name = indx === 0 && invalid_source ? 'test' : library.sample_name
      lines[indx] = [
        sample_name,
        tag,
        library.template_prep_kit_box_barcode,
        library.volume,
        library.concentration,
        library.insert_size,
      ].join(',')
    })

    return [header, ...lines].join('\n')
  }

  const createLibraryBatchPayloadData = (tags, requests) => {
    const tagArrr = Object.values(tags)
    const libraries_attributes = Object.values(storeData.libraries).map((library) => {
      const tag = tagArrr.find((t) => t.id === String(library.tag_id))?.group_id
      const request = requests.find((r) => r.sample_name === library.sample_name)
      return {
        ...library,
        pacbio_request_id: request?.id,
        tag_id: tag,
        primary_aliquot_attributes: {
          tag_id: tag,
          volume: library.volume,
          concentration: library.concentration,
          insert_size: library.insert_size,
          template_prep_kit_box_barcode: library.template_prep_kit_box_barcode,
        },
      }
    })
    return {
      type: 'library_batches',
      attributes: { libraries_attributes },
    }
  }

  return {
    ...BaseFactory(data),
    storeData,
    createLibraryBatchPayloadData,
    createCsvFromLibraryBatchData,
  }
}

export default PacbioLibraryBatchFactory
