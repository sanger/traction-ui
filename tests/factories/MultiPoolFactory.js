import BaseFactory from './BaseFactory.js'
import { dataToObjectById } from './../../src/api/JsonApi.js'

const createStoreData = (data) => {
  const multiPools = dataToObjectById({ data: data.data, includeRelationships: false })
  return {
    resources: {
      multiPools,
    },
  }
}

const MultiPoolFactory = () => {
  // http://localhost:3100/v1/multi_pools?include=multi_pool_positions.pacbio_pool
  const data = {
    data: [
      {
        id: '3',
        type: 'multi_pools',
        links: { self: 'http://localhost:3100/v1/multi_pools/3' },
        attributes: {
          pool_method: 'Plate',
          pipeline: 'pacbio',
          number_of_pools: 2,
          created_at: '2026/01/09 15:02',
        },
        relationships: {
          multi_pool_positions: {
            links: {
              self: 'http://localhost:3100/v1/multi_pools/3/relationships/multi_pool_positions',
              related: 'http://localhost:3100/v1/multi_pools/3/multi_pool_positions',
            },
            data: [
              { type: 'multi_pool_positions', id: '5' },
              { type: 'multi_pool_positions', id: '6' },
            ],
          },
        },
      },
      {
        id: '2',
        type: 'multi_pools',
        links: { self: 'http://localhost:3100/v1/multi_pools/2' },
        attributes: {
          pool_method: 'Plate',
          pipeline: 'pacbio',
          number_of_pools: 2,
          created_at: '2026/01/09 15:02',
        },
        relationships: {
          multi_pool_positions: {
            links: {
              self: 'http://localhost:3100/v1/multi_pools/2/relationships/multi_pool_positions',
              related: 'http://localhost:3100/v1/multi_pools/2/multi_pool_positions',
            },
            data: [
              { type: 'multi_pool_positions', id: '3' },
              { type: 'multi_pool_positions', id: '4' },
            ],
          },
        },
      },
      {
        id: '1',
        type: 'multi_pools',
        links: { self: 'http://localhost:3100/v1/multi_pools/1' },
        attributes: {
          pool_method: 'Plate',
          pipeline: 'pacbio',
          number_of_pools: 2,
          created_at: '2026/01/09 15:02',
        },
        relationships: {
          multi_pool_positions: {
            links: {
              self: 'http://localhost:3100/v1/multi_pools/1/relationships/multi_pool_positions',
              related: 'http://localhost:3100/v1/multi_pools/1/multi_pool_positions',
            },
            data: [
              { type: 'multi_pool_positions', id: '1' },
              { type: 'multi_pool_positions', id: '2' },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '1',
        type: 'multi_pool_positions',
        attributes: {
          position: 'D10',
          pool_id: 11,
          pool_type: 'Pacbio::Pool',
          created_at: '2026/01/09 15:02',
        },
        relationships: {
          multi_pool: { data: { type: 'multi_pools', id: '1' } },
          pacbio_pool: { data: { type: 'pools', id: '11' } },
        },
      },
      {
        id: '2',
        type: 'multi_pool_positions',
        attributes: {
          position: 'A1',
          pool_id: 12,
          pool_type: 'Pacbio::Pool',
          created_at: '2026/01/09 15:02',
        },
        relationships: {
          multi_pool: { data: { type: 'multi_pools', id: '1' } },
          pacbio_pool: { data: { type: 'pools', id: '12' } },
        },
      },
      {
        id: '3',
        type: 'multi_pool_positions',
        attributes: {
          position: 'E6',
          pool_id: 13,
          pool_type: 'Pacbio::Pool',
          created_at: '2026/01/09 15:02',
        },
        relationships: {
          multi_pool: { data: { type: 'multi_pools', id: '2' } },
          pacbio_pool: { data: { type: 'pools', id: '13' } },
        },
      },
      {
        id: '4',
        type: 'multi_pool_positions',
        attributes: {
          position: 'B9',
          pool_id: 14,
          pool_type: 'Pacbio::Pool',
          created_at: '2026/01/09 15:02',
        },
        relationships: {
          multi_pool: { data: { type: 'multi_pools', id: '2' } },
          pacbio_pool: { data: { type: 'pools', id: '14' } },
        },
      },
      {
        id: '5',
        type: 'multi_pool_positions',
        attributes: {
          position: 'H9',
          pool_id: 15,
          pool_type: 'Pacbio::Pool',
          created_at: '2026/01/09 15:02',
        },
        relationships: {
          multi_pool: { data: { type: 'multi_pools', id: '3' } },
          pacbio_pool: { data: { type: 'pools', id: '15' } },
        },
      },
      {
        id: '6',
        type: 'multi_pool_positions',
        attributes: {
          position: 'E3',
          pool_id: 16,
          pool_type: 'Pacbio::Pool',
          created_at: '2026/01/09 15:02',
        },
        relationships: {
          multi_pool: { data: { type: 'multi_pools', id: '3' } },
          pacbio_pool: { data: { type: 'pools', id: '16' } },
        },
      },
      {
        id: '16',
        type: 'pools',
        links: { self: 'http://localhost:3100/v1/pacbio/pools/16' },
        attributes: {
          run_suitability: { ready_for_run: true, errors: [] },
          volume: 20.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 600,
          created_at: '2026/01/09 15:02',
          updated_at: '2026/01/09 15:02',
          used_volume: 0,
          available_volume: 20.0,
          source_identifier: 'GEN-1767970937-1:B6-E6',
          barcode: 'TRAC-2-26',
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/16/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/pools/16/tube',
            },
          },
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/16/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/pools/16/used_aliquots',
            },
          },
          primary_aliquot: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/16/relationships/primary_aliquot',
              related: 'http://localhost:3100/v1/pacbio/pools/16/primary_aliquot',
            },
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/16/relationships/requests',
              related: 'http://localhost:3100/v1/pacbio/pools/16/requests',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/16/relationships/libraries',
              related: 'http://localhost:3100/v1/pacbio/pools/16/libraries',
            },
          },
        },
      },
      {
        id: '15',
        type: 'pools',
        links: { self: 'http://localhost:3100/v1/pacbio/pools/15' },
        attributes: {
          run_suitability: { ready_for_run: true, errors: [] },
          volume: 20.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 600,
          created_at: '2026/01/09 15:02',
          updated_at: '2026/01/09 15:02',
          used_volume: 0,
          available_volume: 20.0,
          source_identifier: 'GEN-1767970937-1:A6',
          barcode: 'TRAC-2-25',
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/15/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/pools/15/tube',
            },
          },
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/15/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/pools/15/used_aliquots',
            },
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
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/15/relationships/libraries',
              related: 'http://localhost:3100/v1/pacbio/pools/15/libraries',
            },
          },
        },
      },
      {
        id: '14',
        type: 'pools',
        links: { self: 'http://localhost:3100/v1/pacbio/pools/14' },
        attributes: {
          run_suitability: { ready_for_run: true, errors: [] },
          volume: 20.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 600,
          created_at: '2026/01/09 15:02',
          updated_at: '2026/01/09 15:02',
          used_volume: 0,
          available_volume: 20.0,
          source_identifier: 'GEN-1767970937-1:E5-H5',
          barcode: 'TRAC-2-24',
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/14/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/pools/14/tube',
            },
          },
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/14/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/pools/14/used_aliquots',
            },
          },
          primary_aliquot: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/14/relationships/primary_aliquot',
              related: 'http://localhost:3100/v1/pacbio/pools/14/primary_aliquot',
            },
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/14/relationships/requests',
              related: 'http://localhost:3100/v1/pacbio/pools/14/requests',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/14/relationships/libraries',
              related: 'http://localhost:3100/v1/pacbio/pools/14/libraries',
            },
          },
        },
      },
      {
        id: '13',
        type: 'pools',
        links: { self: 'http://localhost:3100/v1/pacbio/pools/13' },
        attributes: {
          run_suitability: { ready_for_run: true, errors: [] },
          volume: 20.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 600,
          created_at: '2026/01/09 15:02',
          updated_at: '2026/01/09 15:02',
          used_volume: 0,
          available_volume: 20.0,
          source_identifier: 'GEN-1767970937-1:D5',
          barcode: 'TRAC-2-23',
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/13/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/pools/13/tube',
            },
          },
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/13/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/pools/13/used_aliquots',
            },
          },
          primary_aliquot: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/13/relationships/primary_aliquot',
              related: 'http://localhost:3100/v1/pacbio/pools/13/primary_aliquot',
            },
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/13/relationships/requests',
              related: 'http://localhost:3100/v1/pacbio/pools/13/requests',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/13/relationships/libraries',
              related: 'http://localhost:3100/v1/pacbio/pools/13/libraries',
            },
          },
        },
      },
      {
        id: '12',
        type: 'pools',
        links: { self: 'http://localhost:3100/v1/pacbio/pools/12' },
        attributes: {
          run_suitability: { ready_for_run: true, errors: [] },
          volume: 20.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 600,
          created_at: '2026/01/09 15:02',
          updated_at: '2026/01/09 15:02',
          used_volume: 0,
          available_volume: 20.0,
          source_identifier: 'GEN-1767970937-1:H4-C5',
          barcode: 'TRAC-2-22',
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/12/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/pools/12/tube',
            },
          },
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/12/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/pools/12/used_aliquots',
            },
          },
          primary_aliquot: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/12/relationships/primary_aliquot',
              related: 'http://localhost:3100/v1/pacbio/pools/12/primary_aliquot',
            },
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/12/relationships/requests',
              related: 'http://localhost:3100/v1/pacbio/pools/12/requests',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/12/relationships/libraries',
              related: 'http://localhost:3100/v1/pacbio/pools/12/libraries',
            },
          },
        },
      },
      {
        id: '11',
        type: 'pools',
        links: { self: 'http://localhost:3100/v1/pacbio/pools/11' },
        attributes: {
          run_suitability: { ready_for_run: true, errors: [] },
          volume: 20.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 600,
          created_at: '2026/01/09 15:02',
          updated_at: '2026/01/09 15:02',
          used_volume: 0,
          available_volume: 20.0,
          source_identifier: 'GEN-1767970937-1:G4',
          barcode: 'TRAC-2-21',
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/11/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/pools/11/tube',
            },
          },
          used_aliquots: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/11/relationships/used_aliquots',
              related: 'http://localhost:3100/v1/pacbio/pools/11/used_aliquots',
            },
          },
          primary_aliquot: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/11/relationships/primary_aliquot',
              related: 'http://localhost:3100/v1/pacbio/pools/11/primary_aliquot',
            },
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/11/relationships/requests',
              related: 'http://localhost:3100/v1/pacbio/pools/11/requests',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/pools/11/relationships/libraries',
              related: 'http://localhost:3100/v1/pacbio/pools/11/libraries',
            },
          },
        },
      },
    ],
    meta: { page_count: 1 },
    links: {
      first:
        'http://localhost:3100/v1/multi_pools?include=multi_pool_positions.pacbio_pool&page%5Bnumber%5D=1&page%5Bsize%5D=1000',
      last: 'http://localhost:3100/v1/multi_pools?include=multi_pool_positions.pacbio_pool&page%5Bnumber%5D=1&page%5Bsize%5D=1000',
    },
  }
  return { ...BaseFactory(data), storeData: createStoreData(data) }
}

export default MultiPoolFactory
