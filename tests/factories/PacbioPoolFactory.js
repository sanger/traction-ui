import BaseFactory from './BaseFactory.js'
import {
  dataToObjectById,
  groupIncludedByResource,
  find,
  extractAttributes,
} from './../../src/api/JsonApi.js'
import {
  assignLibraryRequestsToTubes,
  createUsedAliquotsAndMapToSourceId,
} from './../../src/stores/utilities/pool.js'

/**
 *
 * @param {Object} data
 * @returns {Object} - libraries, pools, tubes, tags, requests, used_aliquots
 * pulls out data according to find particular pool
 */
const createStoreDataForSinglePool = (data) => {
  const pool = extractAttributes(data.data)
  const {
    aliquots = [],
    requests,
    wells,
    plates = [],
    tag_sets: [tag_set] = [{}],
    tubes = [],
    libraries = [],
  } = groupIncludedByResource(data.included)

  const storeLibraries = dataToObjectById({ data: libraries, includeRelationships: true })
  const storeRequests = dataToObjectById({ data: requests, includeRelationships: true })

  const storeTubes = assignLibraryRequestsToTubes({
    libraries: storeLibraries,
    requests: storeRequests,
    tubes,
  })

  const used_aliquots = createUsedAliquotsAndMapToSourceId({
    aliquots,
    libraries: storeLibraries,
  })

  return {
    resources: {
      tubes: storeTubes,
      requests: storeRequests,
      libraries: storeLibraries,
      wells: dataToObjectById({ data: wells, includeRelationships: true }),
      plates: dataToObjectById({ data: plates, includeRelationships: true }),
    },
    pool,
    used_aliquots,
    selected: {
      tagSet: { id: tag_set.id },
    },
  }
}

/**
 * @param {Object} data - data from the API
 * @returns {Object} - libraries, pools, tubes, tags, requests, used_aliquots
 * pulls out data for all pools
 */
const createStoreDataForMultiplePools = (data) => {
  const { tubes, aliquots, tags, requests, libraries } = groupIncludedByResource(data.included)

  return {
    libraries: dataToObjectById({ data: libraries }),
    pools: dataToObjectById({ data: data.data, includeRelationships: true }),
    tubes: dataToObjectById({ data: tubes }),
    tags: dataToObjectById({ data: tags }),
    requests: dataToObjectById({ data: requests }),
    used_aliquots: dataToObjectById({ data: aliquots, includeRelationships: true }),
  }
}

/**
 *
 * @param {Object} data - data from the API
 * @param {Integer} count - number of pools
 * @returns {Object} - data for the store
 */
const createStoreData = (data, count) => {
  if (count === 1) {
    return createStoreDataForSinglePool(data)
  } else {
    return createStoreDataForMultiplePools(data)
  }
}

/**
 *
 * @param {Object} data
 * @param {Integer} count - number of pools
 * @param {Integer} start - start index
 * @param {Boolean} includeAll
 * @returns Factory with storeData
 */
const getData = (data, start, count, includeAll) => {
  const foundData = find({ data, start, count, includeAll })
  return { ...BaseFactory(foundData), storeData: createStoreData(foundData, count) }
}

/**
 * Factory for creating a list of pools
 * @param {Integer} count - The number of pools to create
 * @param {Boolean} includeAll - Add all the included data
 * @param {Integer} start - The index to start from
 * @returns a base factory object with the pools data
 * It would be better to pull the pools out by barcode or id
 */
const PacbioPoolFactory = ({ count = undefined, includeAll = false, start = 0 } = {}) => {
  const data = {
    data: [
      {
        id: '6011',
        type: 'pools',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          volume: 15.0,
          concentration: 12.54,
          template_prep_kit_box_barcode: '036037102141700123124',
          insert_size: 9647,
          created_at: '2024/11/04 13:49',
          updated_at: '2024/11/04 13:49',
          used_volume: 15.0,
          available_volume: 0.0,
          source_identifier: 'TRAC-2-11876,TRAC-2-11877',
          barcode: 'TRAC-2-1',
        },
        relationships: {
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/used_aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '35493',
              },
              {
                type: 'aliquots',
                id: '35494',
              },
            ],
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/relationships/primary_aliquot',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/primary_aliquot',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/requests',
            },
            data: [],
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '14160',
              },
              {
                type: 'libraries',
                id: '14159',
              },
            ],
          },
        },
      },
      {
        id: '15',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/pacbio/pools/15',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          volume: 20.0,
          concentration: 10.0,
          template_prep_kit_box_barcode: 'ABC123',
          insert_size: 100,
          created_at: '2024/11/18 22:47',
          updated_at: '2024/11/18 22:47',
          used_volume: 0,
          available_volume: 20.0,
          source_identifier: 'GEN-1730730210-1:A1-B1',
          barcode: 'TRAC-2-15',
        },
        relationships: {
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/15/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/pools/15/used_aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '323',
              },
              {
                type: 'aliquots',
                id: '324',
              },
            ],
          },
          primary_aliquot: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/15/relationships/primary_aliquot',
              related: 'http://localhost:3100/v1/pacbio/pools/15/primary_aliquot',
            },
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/15/relationships/requests',
              related: 'http://localhost:3100/v1/pacbio/pools/15/requests',
            },
            data: [
              {
                type: 'requests',
                id: '100',
              },
              {
                type: 'requests',
                id: '101',
              },
            ],
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/15/relationships/libraries',
              related: 'http://localhost:3100/v1/pacbio/pools/15/libraries',
            },
            data: [],
          },
        },
      },
      {
        id: '1',
        type: 'pools',
        links: {
          self: '/v1/pacbio/pools/1',
        },
        attributes: {
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: 'LK12345',
          insert_size: 100,
          source_identifier: 'DN1:A1',
          created_at: '2021-07-15T15:26:29.000Z',
          updated_at: '2021-07-15T15:26:29.000Z',
          barcode: 'TRAC-2-5',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          used_aliquots: {
            links: {
              self: '/v1/pacbio/pools/1/relationships/aliquots',
              related: '/v1/pacbio/pools/1/aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '1',
              },
            ],
          },
        },
      },
      {
        id: '2',
        type: 'pools',
        links: {
          self: '/v1/pacbio/pools/2',
        },
        attributes: {
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: 'LK12345',
          insert_size: 100,
          source_identifier: 'DN1:B1',
          created_at: '2021-07-15T15:26:29.000Z',
          updated_at: '2021-07-15T15:26:29.000Z',
          barcode: 'TRAC-2-6',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          used_aliquots: {
            links: {
              self: '/v1/pacbio/pools/2/relationships/aliquots',
              related: '/v1/pacbio/pools/2/aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '2',
              },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '35493',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 14159,
          source_type: 'Pacbio::Library',
          used_by_id: 6011,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 7.5,
          concentration: 12.9,
          insert_size: 9933,
          template_prep_kit_box_barcode: '036037102141700123124',
          tag_id: 368,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/tag',
            },
            data: {
              type: 'tags',
              id: '368',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/pool',
            },
            data: {
              type: 'pools',
              id: '6011',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/library',
            },
          },
        },
      },
      {
        id: '35494',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 14160,
          source_type: 'Pacbio::Library',
          used_by_id: 6011,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 7.5,
          concentration: 12.2,
          insert_size: 9360,
          template_prep_kit_box_barcode: '036037102141700123124',
          tag_id: 369,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/tag',
            },
            data: {
              type: 'tags',
              id: '369',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/pool',
            },
            data: {
              type: 'pools',
              id: '6011',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/library',
            },
          },
        },
      },
      {
        id: '368',
        type: 'tags',
        attributes: {
          oligo: 'CAGCGTCTACGAGTAT',
          group_id: 'bc2080',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '369',
        type: 'tags',
        attributes: {
          oligo: 'CTACTATGTCGAGTAT',
          group_id: 'bc2081',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '7',
        type: 'tag_sets',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tag_sets/7',
        },
        attributes: {
          name: 'Pacbio_96_barcode_plate_v3',
          uuid: '7a7f33e6-4912-4505-0d1e-3ceef7c93695',
          pipeline: 'pacbio',
        },
        relationships: {
          tags: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tag_sets/7/relationships/tags',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tag_sets/7/tags',
            },
            data: [
              {
                type: 'tags',
                id: '368',
              },
              {
                type: 'tags',
                id: '369',
              },
            ],
          },
        },
      },
      {
        id: '11876',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876',
        },
        attributes: {
          barcode: 'TRAC-2-11876',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/libraries',
            },
            data: {
              type: 'libraries',
              id: '14159',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/requests',
            },
          },
        },
      },
      {
        id: '11877',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877',
        },
        attributes: {
          barcode: 'TRAC-2-11877',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/libraries',
            },
            data: {
              type: 'libraries',
              id: '14160',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/requests',
            },
          },
        },
      },
      {
        id: '14160',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 51.6,
          concentration: 12.2,
          template_prep_kit_box_barcode: '036037102141700123124',
          insert_size: 9360,
          created_at: '2024/10/29 09:05',
          deactivated_at: null,
          source_identifier: 'FS71986093',
          pacbio_request_id: 8951,
          tag_id: 369,
          used_volume: 7.5,
          available_volume: 44.1,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/request',
            },
            data: {
              type: 'requests',
              id: '8951',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/tag',
            },
            data: {
              type: 'tags',
              id: '369',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/tube',
            },
            data: {
              type: 'tubes',
              id: '11877',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '35029',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/used_aliquots',
            },
          },
        },
      },
      {
        id: '14159',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 22.3,
          concentration: 12.9,
          template_prep_kit_box_barcode: '036037102141700123124',
          insert_size: 9933,
          created_at: '2024/10/29 09:04',
          deactivated_at: null,
          source_identifier: 'FS71986813',
          pacbio_request_id: 8950,
          tag_id: 368,
          used_volume: 7.5,
          available_volume: 14.8,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/request',
            },
            data: {
              type: 'requests',
              id: '8950',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/tag',
            },
            data: {
              type: 'tags',
              id: '368',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/tube',
            },
            data: {
              type: 'tubes',
              id: '11876',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '35027',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/used_aliquots',
            },
          },
        },
      },
      {
        id: '8950',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S4699',
          external_study_id: 'cf04ea86-ac82-11e9-8998-68b599768938',
          sample_name: 'DTOL15016449',
          barcode: 'FS71986813',
          sample_species: 'Aplocera plagiata',
          created_at: '2024/09/27 08:37',
          source_identifier: 'FS71986813',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/tube',
            },
          },
        },
      },
      {
        id: '8951',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S4699',
          external_study_id: 'cf04ea86-ac82-11e9-8998-68b599768938',
          sample_name: 'DTOL15016450',
          barcode: 'FS71986093',
          sample_species: 'Mesapamea secalis',
          created_at: '2024/09/27 08:37',
          source_identifier: 'FS71986093',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/tube',
            },
          },
        },
      },
      {
        id: '1',
        type: 'tubes',
        links: {
          self: '/v1/pacbio/tubes/1',
        },
        attributes: {
          barcode: 'TRAC-2-1',
        },
      },
      {
        id: '2',
        type: 'tubes',
        links: {
          self: '/v1/pacbio/tubes/2',
        },
        attributes: {
          barcode: 'TRAC-2-2',
        },
      },
      {
        id: '1',
        type: 'aliquots',
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          source_id: 1,
          source_type: 'Pacbio::Request',
          tag_id: 26,
        },
        links: {
          self: '/v1/pacbio/aliquots/1',
        },
        relationships: {
          request: {
            links: {
              self: '/v1/pacbio/aliquots/1/relationships/request',
              related: '/v1/pacbio/aliquots/1/request',
            },
            data: {
              type: 'requests',
              id: '1',
            },
          },
          tag: {
            links: {
              self: '/v1/pacbio/aliquots/1/relationships/tag',
              related: '/v1/pacbio/aliquots/1/tag',
            },
            data: {
              type: 'tags',
              id: '26',
            },
          },
        },
      },
      {
        id: '2',
        type: 'aliquots',
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          source_id: '2',
          source_type: 'Pacbio::Request',
          tag_id: 7,
        },
        links: {
          self: '/v1/pacbio/aliquots/2',
        },
        relationships: {
          request: {
            links: {
              self: '/v1/pacbio/aliquots/2/relationships/request',
              related: '/v1/pacbio/aliquots/2/request',
            },
            data: {
              type: 'requests',
              id: '2',
            },
          },
          tag: {
            links: {
              self: '/v1/pacbio/aliquots/2/relationships/tag',
              related: '/v1/pacbio/aliquots/2/tag',
            },
            data: {
              type: 'tags',
              id: '7',
            },
          },
        },
      },
      {
        id: '7',
        type: 'tags',
        attributes: {
          group_id: 'bc1011_BAK8A_OA',
        },
      },
      {
        id: '26',
        type: 'tags',
        attributes: {
          group_id: 'bc1019',
        },
      },
      {
        id: '1',
        type: 'requests',
        links: {
          self: '/v1/pacbio/requests/1',
        },
        attributes: {
          sample_name: 'Sample48',
        },
      },
      {
        id: '2',
        type: 'requests',
        links: {
          self: '/v1/pacbio/requests/2',
        },
        attributes: {
          sample_name: 'Sample47',
        },
      },
      {
        id: '323',
        type: 'aliquots',
        links: {
          self: 'http://localhost:3100/v1/pacbio/aliquots/323',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 100,
          source_type: 'Pacbio::Request',
          used_by_id: 15,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 20.0,
          concentration: 10.0,
          insert_size: 100,
          template_prep_kit_box_barcode: 'ABC123',
          tag_id: 289,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/323/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/aliquots/323/tag',
            },
            data: {
              type: 'tags',
              id: '289',
            },
          },
          source: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/323/relationships/source',
              related: 'http://localhost:3100/v1/pacbio/aliquots/323/source',
            },
          },
          used_by: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/323/relationships/used_by',
              related: 'http://localhost:3100/v1/pacbio/aliquots/323/used_by',
            },
          },
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/323/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/aliquots/323/request',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/323/relationships/pool',
              related: 'http://localhost:3100/v1/pacbio/aliquots/323/pool',
            },
            data: {
              type: 'pools',
              id: '15',
            },
          },
          library: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/323/relationships/library',
              related: 'http://localhost:3100/v1/pacbio/aliquots/323/library',
            },
          },
        },
      },
      {
        id: '324',
        type: 'aliquots',
        links: {
          self: 'http://localhost:3100/v1/pacbio/aliquots/324',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 101,
          source_type: 'Pacbio::Request',
          used_by_id: 15,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 20.0,
          concentration: 10.0,
          insert_size: 100,
          template_prep_kit_box_barcode: 'ABC123',
          tag_id: 290,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/324/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/aliquots/324/tag',
            },
            data: {
              type: 'tags',
              id: '290',
            },
          },
          source: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/324/relationships/source',
              related: 'http://localhost:3100/v1/pacbio/aliquots/324/source',
            },
          },
          used_by: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/324/relationships/used_by',
              related: 'http://localhost:3100/v1/pacbio/aliquots/324/used_by',
            },
          },
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/324/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/aliquots/324/request',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/324/relationships/pool',
              related: 'http://localhost:3100/v1/pacbio/aliquots/324/pool',
            },
            data: {
              type: 'pools',
              id: '15',
            },
          },
          library: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/324/relationships/library',
              related: 'http://localhost:3100/v1/pacbio/aliquots/324/library',
            },
          },
        },
      },
      {
        id: '289',
        type: 'tags',
        attributes: {
          oligo: 'ATCGTGCGACGAGTAT',
          group_id: 'bc2001',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '290',
        type: 'tags',
        attributes: {
          oligo: 'TGCATGTCATGAGTAT',
          group_id: 'bc2002',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '7',
            },
          },
        },
      },
      {
        id: '7',
        type: 'tag_sets',
        links: {
          self: 'http://localhost:3100/v1/pacbio/tag_sets/7',
        },
        attributes: {
          name: 'Pacbio_96_barcode_plate_v3',
          uuid: '7a7f33e6-4912-4505-0d1e-3ceef7c93695',
          pipeline: 'pacbio',
        },
        relationships: {
          tags: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tag_sets/7/relationships/tags',
              related: 'http://localhost:3100/v1/pacbio/tag_sets/7/tags',
            },
            data: [
              {
                type: 'tags',
                id: '289',
              },
              {
                type: 'tags',
                id: '290',
              },
            ],
          },
        },
      },
      {
        id: '100',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/100',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: '100',
          number_of_smrt_cells: 3,
          cost_code: 'S10000',
          external_study_id: '7a4cf022-f30a-40a4-a530-39a0c1d1cbc6',
          sample_name: 'GENSAMPLE-1730730210-1',
          barcode: null,
          sample_species: 'human',
          created_at: '2024/11/04 14:23',
          source_identifier: 'GEN-1730730210-1:A1',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/100/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/100/well',
            },
            data: {
              type: 'wells',
              id: '1',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/1/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/1/plate',
            },
            data: {
              type: 'plates',
              id: '1',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/100/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/100/tube',
            },
            data: null,
          },
        },
      },
      {
        id: '101',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/2',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: '100',
          number_of_smrt_cells: 3,
          cost_code: 'S10001',
          external_study_id: '29a6d14b-0896-4f45-9114-3be5a15a5e4c',
          sample_name: 'GENSAMPLE-1730730210-2',
          barcode: null,
          sample_species: 'human',
          created_at: '2024/11/04 14:23',
          source_identifier: 'GEN-1730730210-1:B1',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/101/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/101/well',
            },
            data: {
              type: 'wells',
              id: '2',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/101/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/101/plate',
            },
            data: {
              type: 'plates',
              id: '1',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/101/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/101/tube',
            },
            data: null,
          },
        },
      },
      {
        id: '1',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/plates/1',
        },
        attributes: {
          barcode: 'GEN-1730730210-1',
          created_at: '2024/11/04 14:23',
        },
        relationships: {
          wells: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/plates/1/relationships/wells',
              related: 'http://localhost:3100/v1/pacbio/plates/1/wells',
            },
            data: [
              {
                type: 'wells',
                id: '1',
              },
              {
                type: 'wells',
                id: '2',
              },
            ],
          },
        },
      },
      {
        id: '1',
        type: 'wells',
        attributes: {
          position: 'A1',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '100',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '1',
            },
          },
        },
      },
      {
        id: '2',
        type: 'wells',
        attributes: {
          position: 'B1',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '101',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '1',
            },
          },
        },
      },
      {
        id: '25',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/pacbio/tubes/25',
        },
        attributes: {
          barcode: 'TRAC-2-25',
        },
        relationships: {
          materials: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/25/relationships/materials',
              related: 'http://localhost:3100/v1/pacbio/tubes/25/materials',
            },
          },
          pools: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/25/relationships/pools',
              related: 'http://localhost:3100/v1/pacbio/tubes/25/pools',
            },
            data: [
              {
                type: 'pools',
                id: '15',
              },
            ],
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/25/relationships/libraries',
              related: 'http://localhost:3100/v1/pacbio/tubes/25/libraries',
            },
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/25/relationships/requests',
              related: 'http://localhost:3100/v1/pacbio/tubes/25/requests',
            },
          },
        },
      },
    ],
  }

  return getData(data, start, count, includeAll)
}

export default PacbioPoolFactory
