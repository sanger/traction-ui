import BaseFactory from './BaseFactory.js'
import { groupIncludedByResource } from './../../src/api/JsonApi'

const createIncludedData = (included) => {
  const { tubes, libraries, tags, requests } = groupIncludedByResource(included)
  return {
    tubes,
    libraries,
    tags,
    requests,
  }
}

const OntPoolFactory = () => {
  const data = {
    data: [
      {
        id: '7',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/ont/pools/7',
        },
        attributes: {
          volume: 2.0,
          kit_barcode: 'barcode-1',
          concentration: 4.0,
          insert_size: 1632,
          created_at: '2022/12/12 14:28',
          updated_at: '2022/12/12 14:28',
          source_identifier: 'GEN-1670855325-1:C2, F2',
          final_library_amount: 7.4,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/7/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/7/tube',
            },
            data: {
              type: 'tubes',
              id: '9',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/7/relationships/libraries',
              related: 'http://localhost:3100/v1/ont/pools/7/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '13',
              },
              {
                type: 'libraries',
                id: '14',
              },
              {
                type: 'libraries',
                id: '15',
              },
              {
                type: 'libraries',
                id: '16',
              },
              {
                type: 'libraries',
                id: '17',
              },
            ],
          },
        },
      },
      {
        id: '8',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/ont/pools/8',
        },
        attributes: {
          volume: 1.0,
          kit_barcode: 'barcode-2',
          concentration: 3.0,
          insert_size: 8271,
          created_at: '2022/12/12 14:28',
          updated_at: '2022/12/12 14:28',
          source_identifier: 'GEN-1670855325-1:F1, H1, B2-C2, E2-F2',
          final_library_amount: 0.5,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/8/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/8/tube',
            },
            data: {
              type: 'tubes',
              id: '10',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/8/relationships/libraries',
              related: 'http://localhost:3100/v1/ont/pools/8/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '18',
              },
              {
                type: 'libraries',
                id: '19',
              },
              {
                type: 'libraries',
                id: '20',
              },
              {
                type: 'libraries',
                id: '21',
              },
              {
                type: 'libraries',
                id: '22',
              },
              {
                type: 'libraries',
                id: '23',
              },
              {
                type: 'libraries',
                id: '24',
              },
            ],
          },
        },
      },
      {
        id: '9',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/ont/pools/9',
        },
        attributes: {
          volume: 4.0,
          kit_barcode: 'barcode-3',
          concentration: 8.0,
          insert_size: 3425,
          created_at: '2022/12/12 14:28',
          updated_at: '2022/12/12 14:28',
          source_identifier: 'GEN-1670855325-1:F1-G1, A2, C2-E2, G2',
          final_library_amount: 14.2,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/9/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/9/tube',
            },
            data: {
              type: 'tubes',
              id: '11',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/9/relationships/libraries',
              related: 'http://localhost:3100/v1/ont/pools/9/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '25',
              },
              {
                type: 'libraries',
                id: '26',
              },
              {
                type: 'libraries',
                id: '27',
              },
              {
                type: 'libraries',
                id: '28',
              },
              {
                type: 'libraries',
                id: '29',
              },
              {
                type: 'libraries',
                id: '30',
              },
              {
                type: 'libraries',
                id: '31',
              },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '9',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/9',
        },
        attributes: {
          barcode: 'TRAC-2-9',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/9/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/9/pools',
            },
            data: [
              {
                type: 'pools',
                id: '7',
              },
            ],
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/9/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/9/requests',
            },
          },
        },
      },
      {
        id: '10',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/10',
        },
        attributes: {
          barcode: 'TRAC-2-10',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/10/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/10/pools',
            },
            data: [
              {
                type: 'pools',
                id: '8',
              },
            ],
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/10/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/10/requests',
            },
          },
        },
      },
      {
        id: '11',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/11',
        },
        attributes: {
          barcode: 'TRAC-2-11',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/11/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/11/pools',
            },
            data: [
              {
                type: 'pools',
                id: '9',
              },
            ],
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/11/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/11/requests',
            },
          },
        },
      },
      {
        id: '13',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/13',
        },
        attributes: {
          volume: 1.0,
          kit_barcode: 'barcode-1',
          concentration: 2.0,
          insert_size: 1818,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/13/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/13/request',
            },
            data: {
              type: 'requests',
              id: '11',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/13/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/13/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/13/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/13/tag',
            },
            data: {
              type: 'tags',
              id: '385',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/13/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/13/pool',
            },
            data: {
              type: 'pools',
              id: '7',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/13/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/13/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/13/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/13/source_plate',
            },
          },
        },
      },
      {
        id: '14',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/14',
        },
        attributes: {
          volume: 10.0,
          kit_barcode: 'barcode-1',
          concentration: 1.0,
          insert_size: 7946,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/14/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/14/request',
            },
            data: {
              type: 'requests',
              id: '11',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/14/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/14/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/14/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/14/tag',
            },
            data: {
              type: 'tags',
              id: '386',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/14/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/14/pool',
            },
            data: {
              type: 'pools',
              id: '7',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/14/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/14/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/14/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/14/source_plate',
            },
          },
        },
      },
      {
        id: '15',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/15',
        },
        attributes: {
          volume: 5.0,
          kit_barcode: 'barcode-1',
          concentration: 7.0,
          insert_size: 2636,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/15/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/15/request',
            },
            data: {
              type: 'requests',
              id: '14',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/15/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/15/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/15/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/15/tag',
            },
            data: {
              type: 'tags',
              id: '387',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/15/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/15/pool',
            },
            data: {
              type: 'pools',
              id: '7',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/15/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/15/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/15/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/15/source_plate',
            },
          },
        },
      },
      {
        id: '16',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/16',
        },
        attributes: {
          volume: 5.0,
          kit_barcode: 'barcode-1',
          concentration: 5.0,
          insert_size: 2291,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/16/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/16/request',
            },
            data: {
              type: 'requests',
              id: '11',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/16/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/16/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/16/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/16/tag',
            },
            data: {
              type: 'tags',
              id: '388',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/16/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/16/pool',
            },
            data: {
              type: 'pools',
              id: '7',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/16/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/16/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/16/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/16/source_plate',
            },
          },
        },
      },
      {
        id: '17',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/17',
        },
        attributes: {
          volume: 3.0,
          kit_barcode: 'barcode-1',
          concentration: 3.0,
          insert_size: 4160,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/17/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/17/request',
            },
            data: {
              type: 'requests',
              id: '14',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/17/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/17/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/17/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/17/tag',
            },
            data: {
              type: 'tags',
              id: '389',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/17/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/17/pool',
            },
            data: {
              type: 'pools',
              id: '7',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/17/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/17/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/17/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/17/source_plate',
            },
          },
        },
      },
      {
        id: '18',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/18',
        },
        attributes: {
          volume: 10.0,
          kit_barcode: 'barcode-2',
          concentration: 1.0,
          insert_size: 4182,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/18/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/18/request',
            },
            data: {
              type: 'requests',
              id: '10',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/18/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/18/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/18/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/18/tag',
            },
            data: {
              type: 'tags',
              id: '385',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/18/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/18/pool',
            },
            data: {
              type: 'pools',
              id: '8',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/18/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/18/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/18/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/18/source_plate',
            },
          },
        },
      },
      {
        id: '19',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/19',
        },
        attributes: {
          volume: 6.0,
          kit_barcode: 'barcode-2',
          concentration: 9.0,
          insert_size: 9297,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/19/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/19/request',
            },
            data: {
              type: 'requests',
              id: '6',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/19/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/19/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/19/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/19/tag',
            },
            data: {
              type: 'tags',
              id: '386',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/19/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/19/pool',
            },
            data: {
              type: 'pools',
              id: '8',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/19/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/19/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/19/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/19/source_plate',
            },
          },
        },
      },
      {
        id: '20',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/20',
        },
        attributes: {
          volume: 10.0,
          kit_barcode: 'barcode-2',
          concentration: 8.0,
          insert_size: 2758,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/20/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/20/request',
            },
            data: {
              type: 'requests',
              id: '14',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/20/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/20/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/20/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/20/tag',
            },
            data: {
              type: 'tags',
              id: '387',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/20/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/20/pool',
            },
            data: {
              type: 'pools',
              id: '8',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/20/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/20/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/20/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/20/source_plate',
            },
          },
        },
      },
      {
        id: '21',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/21',
        },
        attributes: {
          volume: 9.0,
          kit_barcode: 'barcode-2',
          concentration: 1.0,
          insert_size: 6906,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/21/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/21/request',
            },
            data: {
              type: 'requests',
              id: '13',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/21/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/21/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/21/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/21/tag',
            },
            data: {
              type: 'tags',
              id: '388',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/21/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/21/pool',
            },
            data: {
              type: 'pools',
              id: '8',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/21/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/21/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/21/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/21/source_plate',
            },
          },
        },
      },
      {
        id: '22',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/22',
        },
        attributes: {
          volume: 5.0,
          kit_barcode: 'barcode-2',
          concentration: 10.0,
          insert_size: 4418,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/22/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/22/request',
            },
            data: {
              type: 'requests',
              id: '13',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/22/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/22/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/22/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/22/tag',
            },
            data: {
              type: 'tags',
              id: '389',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/22/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/22/pool',
            },
            data: {
              type: 'pools',
              id: '8',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/22/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/22/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/22/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/22/source_plate',
            },
          },
        },
      },
      {
        id: '23',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/23',
        },
        attributes: {
          volume: 2.0,
          kit_barcode: 'barcode-2',
          concentration: 9.0,
          insert_size: 5985,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/23/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/23/request',
            },
            data: {
              type: 'requests',
              id: '11',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/23/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/23/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/23/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/23/tag',
            },
            data: {
              type: 'tags',
              id: '390',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/23/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/23/pool',
            },
            data: {
              type: 'pools',
              id: '8',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/23/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/23/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/23/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/23/source_plate',
            },
          },
        },
      },
      {
        id: '24',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/24',
        },
        attributes: {
          volume: 8.0,
          kit_barcode: 'barcode-2',
          concentration: 10.0,
          insert_size: 8796,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/24/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/24/request',
            },
            data: {
              type: 'requests',
              id: '8',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/24/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/24/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/24/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/24/tag',
            },
            data: {
              type: 'tags',
              id: '391',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/24/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/24/pool',
            },
            data: {
              type: 'pools',
              id: '8',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/24/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/24/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/24/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/24/source_plate',
            },
          },
        },
      },
      {
        id: '25',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/25',
        },
        attributes: {
          volume: 7.0,
          kit_barcode: 'barcode-3',
          concentration: 10.0,
          insert_size: 4334,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/25/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/25/request',
            },
            data: {
              type: 'requests',
              id: '12',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/25/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/25/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/25/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/25/tag',
            },
            data: {
              type: 'tags',
              id: '385',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/25/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/25/pool',
            },
            data: {
              type: 'pools',
              id: '9',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/25/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/25/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/25/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/25/source_plate',
            },
          },
        },
      },
      {
        id: '26',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/26',
        },
        attributes: {
          volume: 5.0,
          kit_barcode: 'barcode-3',
          concentration: 6.0,
          insert_size: 9461,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/26/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/26/request',
            },
            data: {
              type: 'requests',
              id: '11',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/26/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/26/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/26/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/26/tag',
            },
            data: {
              type: 'tags',
              id: '386',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/26/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/26/pool',
            },
            data: {
              type: 'pools',
              id: '9',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/26/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/26/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/26/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/26/source_plate',
            },
          },
        },
      },
      {
        id: '27',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/27',
        },
        attributes: {
          volume: 6.0,
          kit_barcode: 'barcode-3',
          concentration: 4.0,
          insert_size: 4129,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/27/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/27/request',
            },
            data: {
              type: 'requests',
              id: '9',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/27/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/27/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/27/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/27/tag',
            },
            data: {
              type: 'tags',
              id: '387',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/27/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/27/pool',
            },
            data: {
              type: 'pools',
              id: '9',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/27/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/27/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/27/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/27/source_plate',
            },
          },
        },
      },
      {
        id: '28',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/28',
        },
        attributes: {
          volume: 10.0,
          kit_barcode: 'barcode-3',
          concentration: 6.0,
          insert_size: 1732,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/28/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/28/request',
            },
            data: {
              type: 'requests',
              id: '7',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/28/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/28/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/28/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/28/tag',
            },
            data: {
              type: 'tags',
              id: '388',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/28/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/28/pool',
            },
            data: {
              type: 'pools',
              id: '9',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/28/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/28/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/28/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/28/source_plate',
            },
          },
        },
      },
      {
        id: '29',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/29',
        },
        attributes: {
          volume: 9.0,
          kit_barcode: 'barcode-3',
          concentration: 6.0,
          insert_size: 7437,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/29/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/29/request',
            },
            data: {
              type: 'requests',
              id: '13',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/29/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/29/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/29/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/29/tag',
            },
            data: {
              type: 'tags',
              id: '389',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/29/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/29/pool',
            },
            data: {
              type: 'pools',
              id: '9',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/29/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/29/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/29/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/29/source_plate',
            },
          },
        },
      },
      {
        id: '30',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/30',
        },
        attributes: {
          volume: 5.0,
          kit_barcode: 'barcode-3',
          concentration: 9.0,
          insert_size: 7056,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/30/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/30/request',
            },
            data: {
              type: 'requests',
              id: '6',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/30/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/30/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/30/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/30/tag',
            },
            data: {
              type: 'tags',
              id: '390',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/30/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/30/pool',
            },
            data: {
              type: 'pools',
              id: '9',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/30/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/30/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/30/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/30/source_plate',
            },
          },
        },
      },
      {
        id: '31',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/31',
        },
        attributes: {
          volume: 8.0,
          kit_barcode: 'barcode-3',
          concentration: 4.0,
          insert_size: 6947,
          created_at: '2022/12/12 14:28',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/31/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/31/request',
            },
            data: {
              type: 'requests',
              id: '15',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/31/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/31/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/31/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/31/tag',
            },
            data: {
              type: 'tags',
              id: '391',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/31/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/31/pool',
            },
            data: {
              type: 'pools',
              id: '9',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/31/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/31/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/31/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/31/source_plate',
            },
          },
        },
      },
      {
        id: '385',
        type: 'tags',
        attributes: {
          oligo: 'CACAAAGACACCGACAACTTTCTT',
          group_id: 'NB01',
        },
      },
      {
        id: '386',
        type: 'tags',
        attributes: {
          oligo: 'ACAGACGACTACAAACGGAATCGA',
          group_id: 'NB02',
        },
      },
      {
        id: '387',
        type: 'tags',
        attributes: {
          oligo: 'CCTGGTAACTGGGACACAAGACTC',
          group_id: 'NB03',
        },
      },
      {
        id: '388',
        type: 'tags',
        attributes: {
          oligo: 'TAGGGAAACACGATAGAATCCGAA',
          group_id: 'NB04',
        },
      },
      {
        id: '389',
        type: 'tags',
        attributes: {
          oligo: 'AAGGTTACACAAACCCTGGACAAG',
          group_id: 'NB05',
        },
      },
      {
        id: '390',
        type: 'tags',
        attributes: {
          oligo: 'GACTACTTTCTGCCTTTGCGAGAA',
          group_id: 'NB06',
        },
      },
      {
        id: '391',
        type: 'tags',
        attributes: {
          oligo: 'AAGGATTCATTCCCACGGTAACAC',
          group_id: 'NB07',
        },
      },
      {
        id: '15',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/15',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10014',
          external_study_id: '4c22e7c5-070e-4d95-9f50-b1dd8f6690d8',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1670855325-15',
          source_identifier: 'GEN-1670855325-1:G2',
          created_at: '2022/12/12 14:28',
        },
      },
      {
        id: '14',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/14',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10013',
          external_study_id: 'c1113be1-7a8f-4936-84be-bdc055aaeede',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1670855325-14',
          source_identifier: 'GEN-1670855325-1:F2',
          created_at: '2022/12/12 14:28',
        },
      },
      {
        id: '13',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/13',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10012',
          external_study_id: '1f6768ee-a495-40b6-bc90-1986ba09216c',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1670855325-13',
          source_identifier: 'GEN-1670855325-1:E2',
          created_at: '2022/12/12 14:28',
        },
      },
      {
        id: '12',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/12',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10011',
          external_study_id: '72ca1724-9295-4343-a489-6192d3cbfe92',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1670855325-12',
          source_identifier: 'GEN-1670855325-1:D2',
          created_at: '2022/12/12 14:28',
        },
      },
      {
        id: '11',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/11',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10010',
          external_study_id: '57f82ebf-410b-496d-912d-47558d0dc611',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1670855325-11',
          source_identifier: 'GEN-1670855325-1:C2',
          created_at: '2022/12/12 14:28',
        },
      },
      {
        id: '10',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/10',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10009',
          external_study_id: 'b0332dd4-8313-472a-b0bf-b5b91fa3dc1f',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1670855325-10',
          source_identifier: 'GEN-1670855325-1:B2',
          created_at: '2022/12/12 14:28',
        },
      },
      {
        id: '9',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/9',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10008',
          external_study_id: 'eb895777-6848-49a6-bafa-14d9e38feb67',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1670855325-9',
          source_identifier: 'GEN-1670855325-1:A2',
          created_at: '2022/12/12 14:28',
        },
      },
      {
        id: '8',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/8',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10007',
          external_study_id: 'f6dd0ac7-980f-4a60-88e4-907628a891f0',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1670855325-8',
          source_identifier: 'GEN-1670855325-1:H1',
          created_at: '2022/12/12 14:28',
        },
      },
      {
        id: '7',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/7',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10006',
          external_study_id: 'bfa7f43f-7aff-4932-9a56-240e342079c8',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1670855325-7',
          source_identifier: 'GEN-1670855325-1:G1',
          created_at: '2022/12/12 14:28',
        },
      },
      {
        id: '6',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/6',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10005',
          external_study_id: '41d80ab3-11f5-4757-bb4f-7ec36c317f8a',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1670855325-6',
          source_identifier: 'GEN-1670855325-1:F1',
          created_at: '2022/12/12 14:28',
        },
      },
    ],
    links: {
      first:
        'http://localhost:3100/v1/ont/pools?include=tube%2Clibraries.tag%2Clibraries.request&page%5Bnumber%5D=1&page%5Bsize%5D=3',
      prev: 'http://localhost:3100/v1/ont/pools?include=tube%2Clibraries.tag%2Clibraries.request&page%5Bnumber%5D=2&page%5Bsize%5D=3',
      last: 'http://localhost:3100/v1/ont/pools?include=tube%2Clibraries.tag%2Clibraries.request&page%5Bnumber%5D=3&page%5Bsize%5D=3',
    },
  }

  return { ...BaseFactory(data), includedData: createIncludedData(data.included) }
}

export default OntPoolFactory
