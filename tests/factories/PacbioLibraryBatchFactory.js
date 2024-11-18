import BaseFactory from './BaseFactory'
import { dataToObjectById, groupIncludedByResource } from '@/api/JsonApi'

const PacbioLibraryBatchFactory = () => {
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
          source_identifier: 'GEN-1725896371-4:B3',
          pacbio_request_id: 407,
          tag_id: 1,
          used_volume: 0,
          available_volume: 10,
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
          source_identifier: 'GEN-1725896371-4:B3',
          pacbio_request_id: 407,
          tag_id: 1,
          used_volume: 0,
          available_volume: 10,
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
      {
        id: '121',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/pacbio/tubes/111',
        },
        attributes: {
          barcode: 'TRAC-2-121',
        },
      },
      {
        id: '122',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/pacbio/tubes/111',
        },
        attributes: {
          barcode: 'TRAC-2-122',
        },
      },
    ],
    meta: {
      page_count: 1,
    },
  }

  const createStoreData = ({ data, included }) => {
    const { tubes, libraries } = groupIncludedByResource(included)
    const libraryBatches = dataToObjectById({ data, includeRelationships: true })
    return {
      libraryBatches,
      tubes: dataToObjectById({ data: tubes }),
      libraries: dataToObjectById({ data: libraries }),
    }
  }

  const createLibraryBatchPayloadData = (csvText, requests) => {
    const lines = csvText.split('\n')
    // Skip the header line
    const libraries_attributes = []
    lines.slice(1).forEach((line) => {
      if (!line) return
      const [source, tag, template_prep_kit_box_barcode, volume, concentration, insert_size] =
        line.split(',')
      const attributes = {
        template_prep_kit_box_barcode,
        volume,
        concentration,
        insert_size,
      }
      const request = requests.find((r) => r.sample_name === source)
      libraries_attributes.push({
        pacbio_request_id: request?.id,
        tag_id: tag,
        ...attributes,
        primary_aliquot_attributes: {
          tag_id: tag,
          ...attributes,
        },
      })
    })
    return {
      type: 'library_batches',
      attributes: { libraries_attributes },
    }
  }

  return { ...BaseFactory(data), storeData: createStoreData(data), createLibraryBatchPayloadData }
}

export default PacbioLibraryBatchFactory
