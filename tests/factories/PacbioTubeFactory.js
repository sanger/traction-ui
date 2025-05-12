import BaseFactory from './BaseFactory.js'
import { dataToObjectById, groupIncludedByResource, find } from './../../src/api/JsonApi'
import { assignRequestIdsToTubes } from './../../src/stores/utilities/pacbioPool.js'

/**
 *
 * @param {Object} data
 * @param {transformTubes} - transform the tubes data
 * @returns {Object} - { tubes, tubeBarcodes, aliquots, pools, libraries, requests, tags }
 */
const createStoreData = (data, transformTubes) => {
  const { pools, aliquots, libraries, requests, tags } = groupIncludedByResource(data.included)

  // this happens in pacbioPoolCreate no idea what for.
  const tubes = transformTubes
    ? assignRequestIdsToTubes({ libraries, requests, tubes: data.data })
    : dataToObjectById({ data: data.data, includeRelationships: true })

  return {
    tubes,
    tubeBarcodes: Object.values(tubes).map((tube) => tube.barcode),
    aliquots: dataToObjectById({ data: aliquots, includeRelationships: true }),
    pools: dataToObjectById({ data: pools, includeRelationships: true }),
    libraries: dataToObjectById({ data: libraries, includeRelationships: true }),
    requests: dataToObjectById({ data: requests, includeRelationships: true }),
    tags: dataToObjectById({ data: tags }),
  }
}

/**
 *
 * @param {Object} data
 * @param {String | null} findBy - 'libraries' | 'pools'
 * @param {Boolean} transformTubes - transform the tubes data
 * @returns {Object} - { ...BaseFactory, storeData }
 * if the findBy is libraries or pools find a single record by libraries or pools
 * otherwise return the data as is.
 * This is a bit messy but it will do for now.
 */
const getData = (data, findBy, transformTubes) => {
  let index = null
  if (findBy === 'libraries') {
    index = data.data.findIndex((item) => item.relationships.libraries.data)
  }
  if (findBy === 'pools') {
    index = data.data.findIndex((item) => item.relationships.pools.data.length > 0)
  }

  if (index !== null) {
    // we need to includeAll as the requests for pools are in the libraries and I think
    // pulled out as used_by in the aliquots
    const foundData = find({ data, start: index, count: 1, get: true, includeAll: true })
    return { ...BaseFactory(foundData), storeData: createStoreData(foundData, transformTubes) }
  } else {
    return { ...BaseFactory(data), storeData: createStoreData(data, transformTubes) }
  }
}

/**
 * Factory for creating a list of tag set
 * @param {String | null} findBy
 * @param {Boolean} transformTubes - transform the tubes data
 * @returns a base factory object with the tube data
 */
const PacbioTubeFactory = ({ findBy = null, transformTubes = false } = {}) => {
  const data = {
    data: [
      {
        id: '20',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/pacbio/tubes/20',
        },
        attributes: {
          barcode: 'TRAC-2-20',
        },
        relationships: {
          materials: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/20/relationships/materials',
              related: 'http://localhost:3100/v1/pacbio/tubes/20/materials',
            },
          },
          pools: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/20/relationships/pools',
              related: 'http://localhost:3100/v1/pacbio/tubes/20/pools',
            },
            data: [],
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/20/relationships/libraries',
              related: 'http://localhost:3100/v1/pacbio/tubes/20/libraries',
            },
            data: {
              type: 'libraries',
              id: '30',
            },
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/20/relationships/requests',
              related: 'http://localhost:3100/v1/pacbio/tubes/20/requests',
            },
          },
        },
      },
      {
        id: '22',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/pacbio/tubes/22',
        },
        attributes: {
          barcode: 'TRAC-2-22',
        },
        relationships: {
          materials: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/22/relationships/materials',
              related: 'http://localhost:3100/v1/pacbio/tubes/22/materials',
            },
          },
          pools: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/22/relationships/pools',
              related: 'http://localhost:3100/v1/pacbio/tubes/22/pools',
            },
            data: [
              {
                type: 'pools',
                id: '12',
              },
            ],
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/22/relationships/libraries',
              related: 'http://localhost:3100/v1/pacbio/tubes/22/libraries',
            },
            data: null,
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/22/relationships/requests',
              related: 'http://localhost:3100/v1/pacbio/tubes/22/requests',
            },
          },
        },
      },
      {
        id: '24',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/pacbio/tubes/24',
        },
        attributes: {
          barcode: 'TRAC-2-24',
        },
        relationships: {
          materials: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/24/relationships/materials',
              related: 'http://localhost:3100/v1/pacbio/tubes/24/materials',
            },
          },
          pools: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/24/relationships/pools',
              related: 'http://localhost:3100/v1/pacbio/tubes/24/pools',
            },
            data: [
              {
                type: 'pools',
                id: '14',
              },
            ],
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/24/relationships/libraries',
              related: 'http://localhost:3100/v1/pacbio/tubes/24/libraries',
            },
            data: null,
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/24/relationships/requests',
              related: 'http://localhost:3100/v1/pacbio/tubes/24/requests',
            },
          },
        },
      },
    ],
    included: [
      {
        id: '14',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/pacbio/pools/14',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 100,
          created_at: '2024/03/18 15:03',
          updated_at: '2024/03/18 15:03',
          source_identifier: 'GEN-1710774222-1:E5-H5',
          barcode: 'TRAC-2-24',
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/14/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/pools/14/tube',
            },
            data: {
              type: 'tubes',
              id: '24',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/14/relationships/libraries',
              related: 'http://localhost:3100/v1/pacbio/pools/14/libraries',
            },
          },
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/14/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/pools/14/used_aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '331',
              },
              {
                type: 'aliquots',
                id: '332',
              },
              {
                type: 'aliquots',
                id: '333',
              },
              {
                type: 'aliquots',
                id: '334',
              },
            ],
          },
          primary_aliquot: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/14/relationships/primary_aliquot',
              related: 'http://localhost:3100/v1/pacbio/pools/14/primary_aliquot',
            },
          },
        },
      },
      {
        id: '12',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/pacbio/pools/12',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 100,
          created_at: '2024/03/18 15:03',
          updated_at: '2024/03/18 15:03',
          source_identifier: 'GEN-1710774222-1:H4-C5',
          available_volume: 20,
          barcode: 'TRAC-2-22',
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/12/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/pools/12/tube',
            },
            data: {
              type: 'tubes',
              id: '22',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/12/relationships/libraries',
              related: 'http://localhost:3100/v1/pacbio/pools/12/libraries',
            },
          },
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/12/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/pools/12/used_aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '319',
              },
              {
                type: 'aliquots',
                id: '320',
              },
              {
                type: 'aliquots',
                id: '321',
              },
              {
                type: 'aliquots',
                id: '322',
              },
            ],
          },
          primary_aliquot: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/12/relationships/primary_aliquot',
              related: 'http://localhost:3100/v1/pacbio/pools/12/primary_aliquot',
            },
          },
        },
      },
      {
        id: '319',
        type: 'aliquots',
        links: {
          self: 'http://localhost:3100/v1/pacbio/aliquots/319',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 32,
          source_type: 'Pacbio::Request',
          used_by_id: 12,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 1.0,
          concentration: 1.0,
          insert_size: 500,
          template_prep_kit_box_barcode: '029979102141700063023',
          tag_id: 1,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/319/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/aliquots/319/tag',
            },
            data: {
              type: 'tags',
              id: '1',
            },
          },
          source: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/319/relationships/source',
              related: 'http://localhost:3100/v1/pacbio/aliquots/319/source',
            },
          },
          used_by: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/319/relationships/used_by',
              related: 'http://localhost:3100/v1/pacbio/aliquots/319/used_by',
            },
          },
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/319/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/aliquots/319/request',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/319/relationships/pool',
              related: 'http://localhost:3100/v1/pacbio/aliquots/319/pool',
            },
            data: {
              type: 'pools',
              id: '12',
            },
          },
          library: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/319/relationships/library',
              related: 'http://localhost:3100/v1/pacbio/aliquots/319/library',
            },
            data: {
              type: 'libraries',
              id: '32',
            },
          },
        },
      },
      {
        id: '320',
        type: 'aliquots',
        links: {
          self: 'http://localhost:3100/v1/pacbio/aliquots/320',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 33,
          source_type: 'Pacbio::Request',
          used_by_id: 12,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 1.0,
          concentration: 1.0,
          insert_size: 500,
          template_prep_kit_box_barcode: '029979102141700063023',
          tag_id: 2,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/320/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/aliquots/320/tag',
            },
            data: {
              type: 'tags',
              id: '2',
            },
          },
          source: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/320/relationships/source',
              related: 'http://localhost:3100/v1/pacbio/aliquots/320/source',
            },
          },
          used_by: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/320/relationships/used_by',
              related: 'http://localhost:3100/v1/pacbio/aliquots/320/used_by',
            },
          },
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/320/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/aliquots/320/request',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/320/relationships/pool',
              related: 'http://localhost:3100/v1/pacbio/aliquots/320/pool',
            },
            data: {
              type: 'pools',
              id: '12',
            },
          },
          library: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/320/relationships/library',
              related: 'http://localhost:3100/v1/pacbio/aliquots/320/library',
            },
            data: {
              type: 'libraries',
              id: '33',
            },
          },
        },
      },
      {
        id: '321',
        type: 'aliquots',
        links: {
          self: 'http://localhost:3100/v1/pacbio/aliquots/321',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 34,
          source_type: 'Pacbio::Request',
          used_by_id: 12,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 1.0,
          concentration: 1.0,
          insert_size: 500,
          template_prep_kit_box_barcode: '029979102141700063023',
          tag_id: 3,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/321/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/aliquots/321/tag',
            },
            data: {
              type: 'tags',
              id: '3',
            },
          },
          source: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/321/relationships/source',
              related: 'http://localhost:3100/v1/pacbio/aliquots/321/source',
            },
          },
          used_by: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/321/relationships/used_by',
              related: 'http://localhost:3100/v1/pacbio/aliquots/321/used_by',
            },
          },
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/321/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/aliquots/321/request',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/321/relationships/pool',
              related: 'http://localhost:3100/v1/pacbio/aliquots/321/pool',
            },
            data: {
              type: 'pools',
              id: '12',
            },
          },
          library: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/321/relationships/library',
              related: 'http://localhost:3100/v1/pacbio/aliquots/321/library',
            },
            data: {
              type: 'libraries',
              id: '34',
            },
          },
        },
      },
      {
        id: '322',
        type: 'aliquots',
        links: {
          self: 'http://localhost:3100/v1/pacbio/aliquots/322',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 35,
          source_type: 'Pacbio::Request',
          used_by_id: 12,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 1.0,
          concentration: 1.0,
          insert_size: 500,
          template_prep_kit_box_barcode: '029979102141700063023',
          tag_id: 4,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/322/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/aliquots/322/tag',
            },
            data: {
              type: 'tags',
              id: '4',
            },
          },
          source: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/322/relationships/source',
              related: 'http://localhost:3100/v1/pacbio/aliquots/322/source',
            },
          },
          used_by: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/322/relationships/used_by',
              related: 'http://localhost:3100/v1/pacbio/aliquots/322/used_by',
            },
          },
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/322/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/aliquots/322/request',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/322/relationships/pool',
              related: 'http://localhost:3100/v1/pacbio/aliquots/322/pool',
            },
            data: {
              type: 'pools',
              id: '12',
            },
          },
          library: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/322/relationships/library',
              related: 'http://localhost:3100/v1/pacbio/aliquots/322/library',
            },
            data: {
              type: 'libraries',
              id: '35',
            },
          },
        },
      },
      {
        id: '331',
        type: 'aliquots',
        links: {
          self: 'http://localhost:3100/v1/pacbio/aliquots/331',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 37,
          source_type: 'Pacbio::Request',
          used_by_id: 14,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 1.0,
          concentration: 1.0,
          insert_size: 500,
          template_prep_kit_box_barcode: '029979102141700063023',
          tag_id: 1,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/331/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/aliquots/331/tag',
            },
            data: {
              type: 'tags',
              id: '1',
            },
          },
          source: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/331/relationships/source',
              related: 'http://localhost:3100/v1/pacbio/aliquots/331/source',
            },
          },
          used_by: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/331/relationships/used_by',
              related: 'http://localhost:3100/v1/pacbio/aliquots/331/used_by',
            },
          },
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/331/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/aliquots/331/request',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/331/relationships/pool',
              related: 'http://localhost:3100/v1/pacbio/aliquots/331/pool',
            },
            data: {
              type: 'pools',
              id: '14',
            },
          },
          library: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/331/relationships/library',
              related: 'http://localhost:3100/v1/pacbio/aliquots/331/library',
            },
            data: {
              type: 'libraries',
              id: '37',
            },
          },
        },
      },
      {
        id: '332',
        type: 'aliquots',
        links: {
          self: 'http://localhost:3100/v1/pacbio/aliquots/332',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 38,
          source_type: 'Pacbio::Request',
          used_by_id: 14,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 1.0,
          concentration: 1.0,
          insert_size: 500,
          template_prep_kit_box_barcode: '029979102141700063023',
          tag_id: 2,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/332/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/aliquots/332/tag',
            },
            data: {
              type: 'tags',
              id: '2',
            },
          },
          source: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/332/relationships/source',
              related: 'http://localhost:3100/v1/pacbio/aliquots/332/source',
            },
          },
          used_by: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/332/relationships/used_by',
              related: 'http://localhost:3100/v1/pacbio/aliquots/332/used_by',
            },
          },
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/332/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/aliquots/332/request',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/332/relationships/pool',
              related: 'http://localhost:3100/v1/pacbio/aliquots/332/pool',
            },
            data: {
              type: 'pools',
              id: '14',
            },
          },
          library: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/332/relationships/library',
              related: 'http://localhost:3100/v1/pacbio/aliquots/332/library',
            },
            data: {
              type: 'libraries',
              id: '38',
            },
          },
        },
      },
      {
        id: '333',
        type: 'aliquots',
        links: {
          self: 'http://localhost:3100/v1/pacbio/aliquots/333',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 39,
          source_type: 'Pacbio::Request',
          used_by_id: 14,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 1.0,
          concentration: 1.0,
          insert_size: 500,
          template_prep_kit_box_barcode: '029979102141700063023',
          tag_id: 3,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/333/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/aliquots/333/tag',
            },
            data: {
              type: 'tags',
              id: '3',
            },
          },
          source: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/333/relationships/source',
              related: 'http://localhost:3100/v1/pacbio/aliquots/333/source',
            },
          },
          used_by: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/333/relationships/used_by',
              related: 'http://localhost:3100/v1/pacbio/aliquots/333/used_by',
            },
          },
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/333/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/aliquots/333/request',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/333/relationships/pool',
              related: 'http://localhost:3100/v1/pacbio/aliquots/333/pool',
            },
            data: {
              type: 'pools',
              id: '14',
            },
          },
          library: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/333/relationships/library',
              related: 'http://localhost:3100/v1/pacbio/aliquots/333/library',
            },
            data: {
              type: 'libraries',
              id: '39',
            },
          },
        },
      },
      {
        id: '334',
        type: 'aliquots',
        links: {
          self: 'http://localhost:3100/v1/pacbio/aliquots/334',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 40,
          source_type: 'Pacbio::Request',
          used_by_id: 14,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 1.0,
          concentration: 1.0,
          insert_size: 500,
          template_prep_kit_box_barcode: '029979102141700063023',
          tag_id: 4,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/334/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/aliquots/334/tag',
            },
            data: {
              type: 'tags',
              id: '4',
            },
          },
          source: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/334/relationships/source',
              related: 'http://localhost:3100/v1/pacbio/aliquots/334/source',
            },
          },
          used_by: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/334/relationships/used_by',
              related: 'http://localhost:3100/v1/pacbio/aliquots/334/used_by',
            },
          },
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/334/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/aliquots/334/request',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/334/relationships/pool',
              related: 'http://localhost:3100/v1/pacbio/aliquots/334/pool',
            },
            data: {
              type: 'pools',
              id: '14',
            },
          },
          library: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/334/relationships/library',
              related: 'http://localhost:3100/v1/pacbio/aliquots/334/library',
            },
            data: {
              type: 'libraries',
              id: '40',
            },
          },
        },
      },
      {
        id: '315',
        type: 'aliquots',
        links: {
          self: 'http://localhost:3100/v1/pacbio/aliquots/315',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 30,
          source_type: 'Pacbio::Request',
          used_by_id: 30,
          used_by_type: 'Pacbio::Library',
          state: 'created',
          volume: 1.0,
          concentration: 1.0,
          insert_size: 500,
          template_prep_kit_box_barcode: '029979102141700063023',
          tag_id: null,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/315/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/aliquots/315/tag',
            },
            data: null,
          },
          source: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/315/relationships/source',
              related: 'http://localhost:3100/v1/pacbio/aliquots/315/source',
            },
          },
          used_by: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/315/relationships/used_by',
              related: 'http://localhost:3100/v1/pacbio/aliquots/315/used_by',
            },
          },
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/315/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/aliquots/315/request',
            },
            data: {
              type: 'requests',
              id: '30',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/315/relationships/pool',
              related: 'http://localhost:3100/v1/pacbio/aliquots/315/pool',
            },
          },
          library: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/aliquots/315/relationships/library',
              related: 'http://localhost:3100/v1/pacbio/aliquots/315/library',
            },
            data: {
              type: 'libraries',
              id: '30',
            },
          },
        },
      },
      {
        id: '32',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/pacbio/libraries/32',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 500,
          created_at: '2024/03/18 15:03',
          deactivated_at: null,
          source_identifier: 'GEN-1710774222-1:H4',
          pacbio_request_id: 32,
          tag_id: 1,
          barcode: 'TRAC-2-32',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/32/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/libraries/32/request',
            },
            data: {
              type: 'requests',
              id: '32',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/32/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/libraries/32/tag',
            },
            data: {
              type: 'tags',
              id: '1',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/32/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/libraries/32/tube',
            },
            data: null,
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/32/relationships/source_well',
              related: 'http://localhost:3100/v1/pacbio/libraries/32/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/32/relationships/source_plate',
              related: 'http://localhost:3100/v1/pacbio/libraries/32/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/32/relationships/primary_aliquot',
              related: 'http://localhost:3100/v1/pacbio/libraries/32/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '324',
            },
          },
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/32/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/libraries/32/used_aliquots',
            },
          },
        },
      },
      {
        id: '33',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/pacbio/libraries/33',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 500,
          created_at: '2024/03/18 15:03',
          deactivated_at: null,
          source_identifier: 'GEN-1710774222-1:A5',
          pacbio_request_id: 33,
          tag_id: 2,
          barcode: 'TRAC-2-33',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/33/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/libraries/33/request',
            },
            data: {
              type: 'requests',
              id: '33',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/33/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/libraries/33/tag',
            },
            data: {
              type: 'tags',
              id: '2',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/33/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/libraries/33/tube',
            },
            data: null,
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/33/relationships/source_well',
              related: 'http://localhost:3100/v1/pacbio/libraries/33/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/33/relationships/source_plate',
              related: 'http://localhost:3100/v1/pacbio/libraries/33/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/33/relationships/primary_aliquot',
              related: 'http://localhost:3100/v1/pacbio/libraries/33/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '325',
            },
          },
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/33/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/libraries/33/used_aliquots',
            },
          },
        },
      },
      {
        id: '34',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/pacbio/libraries/34',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 500,
          created_at: '2024/03/18 15:03',
          deactivated_at: null,
          source_identifier: 'GEN-1710774222-1:B5',
          pacbio_request_id: 34,
          tag_id: 3,
          barcode: 'TRAC-2-34',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/34/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/libraries/34/request',
            },
            data: {
              type: 'requests',
              id: '34',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/34/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/libraries/34/tag',
            },
            data: {
              type: 'tags',
              id: '3',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/34/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/libraries/34/tube',
            },
            data: null,
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/34/relationships/source_well',
              related: 'http://localhost:3100/v1/pacbio/libraries/34/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/34/relationships/source_plate',
              related: 'http://localhost:3100/v1/pacbio/libraries/34/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/34/relationships/primary_aliquot',
              related: 'http://localhost:3100/v1/pacbio/libraries/34/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '326',
            },
          },
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/34/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/libraries/34/used_aliquots',
            },
          },
        },
      },
      {
        id: '35',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/pacbio/libraries/35',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 500,
          created_at: '2024/03/18 15:03',
          deactivated_at: null,
          source_identifier: 'GEN-1710774222-1:C5',
          pacbio_request_id: 35,
          tag_id: 4,
          barcode: 'TRAC-2-35',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/35/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/libraries/35/request',
            },
            data: {
              type: 'requests',
              id: '35',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/35/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/libraries/35/tag',
            },
            data: {
              type: 'tags',
              id: '4',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/35/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/libraries/35/tube',
            },
            data: null,
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/35/relationships/source_well',
              related: 'http://localhost:3100/v1/pacbio/libraries/35/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/35/relationships/source_plate',
              related: 'http://localhost:3100/v1/pacbio/libraries/35/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/35/relationships/primary_aliquot',
              related: 'http://localhost:3100/v1/pacbio/libraries/35/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '327',
            },
          },
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/35/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/libraries/35/used_aliquots',
            },
          },
        },
      },
      {
        id: '37',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/pacbio/libraries/37',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 500,
          created_at: '2024/03/18 15:03',
          deactivated_at: null,
          source_identifier: 'GEN-1710774222-1:E5',
          pacbio_request_id: 37,
          tag_id: 1,
          barcode: 'TRAC-2-37',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/37/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/libraries/37/request',
            },
            data: {
              type: 'requests',
              id: '37',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/37/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/libraries/37/tag',
            },
            data: {
              type: 'tags',
              id: '1',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/37/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/libraries/37/tube',
            },
            data: null,
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/37/relationships/source_well',
              related: 'http://localhost:3100/v1/pacbio/libraries/37/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/37/relationships/source_plate',
              related: 'http://localhost:3100/v1/pacbio/libraries/37/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/37/relationships/primary_aliquot',
              related: 'http://localhost:3100/v1/pacbio/libraries/37/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '336',
            },
          },
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/37/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/libraries/37/used_aliquots',
            },
          },
        },
      },
      {
        id: '38',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/pacbio/libraries/38',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 500,
          created_at: '2024/03/18 15:03',
          deactivated_at: null,
          source_identifier: 'GEN-1710774222-1:F5',
          pacbio_request_id: 38,
          tag_id: 2,
          barcode: 'TRAC-2-38',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/38/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/libraries/38/request',
            },
            data: {
              type: 'requests',
              id: '38',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/38/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/libraries/38/tag',
            },
            data: {
              type: 'tags',
              id: '2',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/38/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/libraries/38/tube',
            },
            data: null,
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/38/relationships/source_well',
              related: 'http://localhost:3100/v1/pacbio/libraries/38/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/38/relationships/source_plate',
              related: 'http://localhost:3100/v1/pacbio/libraries/38/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/38/relationships/primary_aliquot',
              related: 'http://localhost:3100/v1/pacbio/libraries/38/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '337',
            },
          },
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/38/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/libraries/38/used_aliquots',
            },
          },
        },
      },
      {
        id: '39',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/pacbio/libraries/39',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 500,
          created_at: '2024/03/18 15:03',
          deactivated_at: null,
          source_identifier: 'GEN-1710774222-1:G5',
          pacbio_request_id: 39,
          tag_id: 3,
          barcode: 'TRAC-2-39',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/39/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/libraries/39/request',
            },
            data: {
              type: 'requests',
              id: '39',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/39/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/libraries/39/tag',
            },
            data: {
              type: 'tags',
              id: '3',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/39/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/libraries/39/tube',
            },
            data: null,
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/39/relationships/source_well',
              related: 'http://localhost:3100/v1/pacbio/libraries/39/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/39/relationships/source_plate',
              related: 'http://localhost:3100/v1/pacbio/libraries/39/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/39/relationships/primary_aliquot',
              related: 'http://localhost:3100/v1/pacbio/libraries/39/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '338',
            },
          },
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/39/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/libraries/39/used_aliquots',
            },
          },
        },
      },
      {
        id: '40',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/pacbio/libraries/40',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 500,
          created_at: '2024/03/18 15:03',
          deactivated_at: null,
          source_identifier: 'GEN-1710774222-1:H5',
          pacbio_request_id: 40,
          tag_id: 4,
          barcode: 'TRAC-2-40',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/40/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/libraries/40/request',
            },
            data: {
              type: 'requests',
              id: '40',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/40/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/libraries/40/tag',
            },
            data: {
              type: 'tags',
              id: '4',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/40/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/libraries/40/tube',
            },
            data: null,
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/40/relationships/source_well',
              related: 'http://localhost:3100/v1/pacbio/libraries/40/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/40/relationships/source_plate',
              related: 'http://localhost:3100/v1/pacbio/libraries/40/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/40/relationships/primary_aliquot',
              related: 'http://localhost:3100/v1/pacbio/libraries/40/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '339',
            },
          },
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/40/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/libraries/40/used_aliquots',
            },
          },
        },
      },
      {
        id: '30',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/pacbio/libraries/30',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 500,
          created_at: '2024/03/18 15:03',
          deactivated_at: null,
          source_identifier: 'GEN-1710774222-1:F4',
          pacbio_request_id: 30,
          available_volume: 20,
          barcode: 'TRAC-2-20',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/30/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/libraries/30/request',
            },
            data: {
              type: 'requests',
              id: '30',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/30/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/libraries/30/tag',
            },
            data: null,
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/30/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/libraries/30/tube',
            },
            data: {
              type: 'tubes',
              id: '20',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/30/relationships/source_well',
              related: 'http://localhost:3100/v1/pacbio/libraries/30/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/30/relationships/source_plate',
              related: 'http://localhost:3100/v1/pacbio/libraries/30/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/30/relationships/primary_aliquot',
              related: 'http://localhost:3100/v1/pacbio/libraries/30/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '314',
            },
          },
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/30/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/libraries/30/used_aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '315',
              },
            ],
          },
        },
      },
      {
        id: '32',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/32',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: '100',
          number_of_smrt_cells: 3,
          cost_code: 'S10031',
          external_study_id: '8d06b245-31aa-48b2-801d-eeaaa9e14e7f',
          sample_name: 'GENSAMPLE-1710774222-32',
          barcode: null,
          sample_species: 'human',
          created_at: '2024/03/18 15:03',
          source_identifier: 'GEN-1710774222-1:H4',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/32/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/32/well',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/32/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/32/plate',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/32/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/32/tube',
            },
          },
        },
      },
      {
        id: '33',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/33',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: '100',
          number_of_smrt_cells: 3,
          cost_code: 'S10032',
          external_study_id: 'cb55e0cb-ccc0-471c-adbd-fc35aac7f7d3',
          sample_name: 'GENSAMPLE-1710774222-33',
          barcode: null,
          sample_species: 'human',
          created_at: '2024/03/18 15:03',
          source_identifier: 'GEN-1710774222-1:A5',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/33/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/33/well',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/33/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/33/plate',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/33/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/33/tube',
            },
          },
        },
      },
      {
        id: '34',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/34',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: '100',
          number_of_smrt_cells: 3,
          cost_code: 'S10033',
          external_study_id: '1bb024f3-14ea-4fd0-bf44-d3f15821a277',
          sample_name: 'GENSAMPLE-1710774222-34',
          barcode: null,
          sample_species: 'human',
          created_at: '2024/03/18 15:03',
          source_identifier: 'GEN-1710774222-1:B5',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/34/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/34/well',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/34/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/34/plate',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/34/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/34/tube',
            },
          },
        },
      },
      {
        id: '35',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/35',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: '100',
          number_of_smrt_cells: 3,
          cost_code: 'S10034',
          external_study_id: 'e2514edd-3996-4f84-8dd8-6646e2736293',
          sample_name: 'GENSAMPLE-1710774222-35',
          barcode: null,
          sample_species: 'human',
          created_at: '2024/03/18 15:03',
          source_identifier: 'GEN-1710774222-1:C5',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/35/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/35/well',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/35/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/35/plate',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/35/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/35/tube',
            },
          },
        },
      },
      {
        id: '37',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/37',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: '100',
          number_of_smrt_cells: 3,
          cost_code: 'S10036',
          external_study_id: '7ffaceef-2b60-433d-a303-6150c30618e1',
          sample_name: 'GENSAMPLE-1710774222-37',
          barcode: null,
          sample_species: 'human',
          created_at: '2024/03/18 15:03',
          source_identifier: 'GEN-1710774222-1:E5',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/37/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/37/well',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/37/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/37/plate',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/37/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/37/tube',
            },
          },
        },
      },
      {
        id: '38',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/38',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: '100',
          number_of_smrt_cells: 3,
          cost_code: 'S10037',
          external_study_id: '2cf7853a-d6a4-4204-b2c3-3bbe25268468',
          sample_name: 'GENSAMPLE-1710774222-38',
          barcode: null,
          sample_species: 'human',
          created_at: '2024/03/18 15:03',
          source_identifier: 'GEN-1710774222-1:F5',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/38/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/38/well',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/38/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/38/plate',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/38/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/38/tube',
            },
          },
        },
      },
      {
        id: '39',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/39',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: '100',
          number_of_smrt_cells: 3,
          cost_code: 'S10038',
          external_study_id: '2d1c2c20-e39b-4786-8f56-07939fb9e3b2',
          sample_name: 'GENSAMPLE-1710774222-39',
          barcode: null,
          sample_species: 'human',
          created_at: '2024/03/18 15:03',
          source_identifier: 'GEN-1710774222-1:G5',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/39/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/39/well',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/39/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/39/plate',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/39/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/39/tube',
            },
          },
        },
      },
      {
        id: '40',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/40',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: '100',
          number_of_smrt_cells: 3,
          cost_code: 'S10039',
          external_study_id: 'f5fb1f9f-4707-4f12-8c50-1598f0e017ba',
          sample_name: 'GENSAMPLE-1710774222-40',
          barcode: null,
          sample_species: 'human',
          created_at: '2024/03/18 15:03',
          source_identifier: 'GEN-1710774222-1:H5',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/40/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/40/well',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/40/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/40/plate',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/40/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/40/tube',
            },
          },
        },
      },
      {
        id: '30',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/30',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: '100',
          number_of_smrt_cells: 3,
          cost_code: 'S10029',
          external_study_id: '849b04d8-8631-4578-8f7f-092f1e5bf0b3',
          sample_name: 'GENSAMPLE-1710774222-30',
          barcode: null,
          sample_species: 'human',
          created_at: '2024/03/18 15:03',
          source_identifier: 'GEN-1710774222-1:F4',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/30/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/30/well',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/30/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/30/plate',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/30/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/30/tube',
            },
          },
        },
      },
      {
        id: '1',
        type: 'tags',
        attributes: {
          oligo: 'CACATATCAGAGTGCGT',
          group_id: 'bc1001_BAK8A_OA',
        },
      },
      {
        id: '2',
        type: 'tags',
        attributes: {
          oligo: 'ACACACAGACTGTGAGT',
          group_id: 'bc1002_BAK8A_OA',
        },
      },
      {
        id: '3',
        type: 'tags',
        attributes: {
          oligo: 'ACACATCTCGTGAGAGT',
          group_id: 'bc1003_BAK8A_OA',
        },
      },
      {
        id: '4',
        type: 'tags',
        attributes: {
          oligo: 'ACAGTCGAGCGCTGCGT',
          group_id: 'bc1008_BAK8A_OA',
        },
      },
    ],
    meta: {
      page_count: null,
    },
  }

  return getData(data, findBy, transformTubes)
}

export default PacbioTubeFactory
