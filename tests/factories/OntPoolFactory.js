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
        id: '15',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/ont/pools/15',
        },
        attributes: {
          volume: 6.0,
          kit_barcode: 'barcode-9',
          concentration: 5.0,
          insert_size: 4203,
          created_at: '2024/08/13 07:35',
          updated_at: '2024/08/13 07:35',
          tube_barcode: 'TRAC-2-42',
          source_identifier: 'GEN-1723534534-1:H1-A2, C2-E2',
          final_library_amount: 10.8,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/15/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/15/tube',
            },
            data: {
              type: 'tubes',
              id: '42',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/15/relationships/libraries',
              related: 'http://localhost:3100/v1/ont/pools/15/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '54',
              },
              {
                type: 'libraries',
                id: '55',
              },
              {
                type: 'libraries',
                id: '56',
              },
              {
                type: 'libraries',
                id: '57',
              },
              {
                type: 'libraries',
                id: '58',
              },
              {
                type: 'libraries',
                id: '59',
              },
              {
                type: 'libraries',
                id: '60',
              },
              {
                type: 'libraries',
                id: '61',
              },
              {
                type: 'libraries',
                id: '62',
              },
            ],
          },
        },
      },
      {
        id: '14',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/ont/pools/14',
        },
        attributes: {
          volume: 3.0,
          kit_barcode: 'barcode-8',
          concentration: 2.0,
          insert_size: 3746,
          created_at: '2024/08/13 07:35',
          updated_at: '2024/08/13 07:35',
          tube_barcode: 'TRAC-2-41',
          source_identifier: 'GEN-1723534534-1:F1, H1, F2',
          final_library_amount: 2.4,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/14/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/14/tube',
            },
            data: {
              type: 'tubes',
              id: '41',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/14/relationships/libraries',
              related: 'http://localhost:3100/v1/ont/pools/14/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '49',
              },
              {
                type: 'libraries',
                id: '50',
              },
              {
                type: 'libraries',
                id: '51',
              },
              {
                type: 'libraries',
                id: '52',
              },
              {
                type: 'libraries',
                id: '53',
              },
            ],
          },
        },
      },
      {
        id: '13',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/ont/pools/13',
        },
        attributes: {
          volume: 8.0,
          kit_barcode: 'barcode-7',
          concentration: 7.0,
          insert_size: 4065,
          created_at: '2024/08/13 07:35',
          updated_at: '2024/08/13 07:35',
          tube_barcode: 'TRAC-2-40',
          source_identifier: 'GEN-1723534534-1:G2',
          final_library_amount: 20.9,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/13/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/13/tube',
            },
            data: {
              type: 'tubes',
              id: '40',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/13/relationships/libraries',
              related: 'http://localhost:3100/v1/ont/pools/13/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '48',
              },
            ],
          },
        },
      },
      {
        id: '12',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/ont/pools/12',
        },
        attributes: {
          volume: 1.0,
          kit_barcode: 'barcode-6',
          concentration: 1.0,
          insert_size: 6092,
          created_at: '2024/08/13 07:35',
          updated_at: '2024/08/13 07:35',
          tube_barcode: 'TRAC-2-39',
          source_identifier: 'GEN-1723534534-1:G1, D2, G2',
          final_library_amount: 0.2,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/12/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/12/tube',
            },
            data: {
              type: 'tubes',
              id: '39',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/12/relationships/libraries',
              related: 'http://localhost:3100/v1/ont/pools/12/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '44',
              },
              {
                type: 'libraries',
                id: '45',
              },
              {
                type: 'libraries',
                id: '46',
              },
              {
                type: 'libraries',
                id: '47',
              },
            ],
          },
        },
      },
      {
        id: '11',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/ont/pools/11',
        },
        attributes: {
          volume: 7.0,
          kit_barcode: 'barcode-5',
          concentration: 8.0,
          insert_size: 8862,
          created_at: '2024/08/13 07:35',
          updated_at: '2024/08/13 07:35',
          tube_barcode: 'TRAC-2-38',
          source_identifier: 'GEN-1723534534-1:F1-H1, B2-D2, F2',
          final_library_amount: 9.6,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/11/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/11/tube',
            },
            data: {
              type: 'tubes',
              id: '38',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/11/relationships/libraries',
              related: 'http://localhost:3100/v1/ont/pools/11/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '35',
              },
              {
                type: 'libraries',
                id: '36',
              },
              {
                type: 'libraries',
                id: '37',
              },
              {
                type: 'libraries',
                id: '38',
              },
              {
                type: 'libraries',
                id: '39',
              },
              {
                type: 'libraries',
                id: '40',
              },
              {
                type: 'libraries',
                id: '41',
              },
              {
                type: 'libraries',
                id: '42',
              },
              {
                type: 'libraries',
                id: '43',
              },
            ],
          },
        },
      },
      {
        id: '10',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/ont/pools/10',
        },
        attributes: {
          volume: 4.0,
          kit_barcode: 'barcode-4',
          concentration: 6.0,
          insert_size: 5599,
          created_at: '2024/08/13 07:35',
          updated_at: '2024/08/13 07:35',
          tube_barcode: 'TRAC-2-37',
          source_identifier: 'GEN-1723534534-1:C2',
          final_library_amount: 6.5,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/10/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/10/tube',
            },
            data: {
              type: 'tubes',
              id: '37',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/10/relationships/libraries',
              related: 'http://localhost:3100/v1/ont/pools/10/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '34',
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
          volume: 8.0,
          kit_barcode: 'barcode-3',
          concentration: 8.0,
          insert_size: 6862,
          created_at: '2024/08/13 07:35',
          updated_at: '2024/08/13 07:35',
          tube_barcode: 'TRAC-2-36',
          source_identifier: 'GEN-1723534534-1:F1, H1-A2, C2, F2',
          final_library_amount: 14.1,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/9/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/9/tube',
            },
            data: {
              type: 'tubes',
              id: '36',
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
                id: '24',
              },
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
              {
                type: 'libraries',
                id: '32',
              },
              {
                type: 'libraries',
                id: '33',
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
          volume: 10.0,
          kit_barcode: 'barcode-2',
          concentration: 9.0,
          insert_size: 9495,
          created_at: '2024/08/13 07:35',
          updated_at: '2024/08/13 07:35',
          tube_barcode: 'TRAC-2-35',
          source_identifier: 'GEN-1723534534-1:F2',
          final_library_amount: 14.4,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/8/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/8/tube',
            },
            data: {
              type: 'tubes',
              id: '35',
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
                id: '23',
              },
            ],
          },
        },
      },
      {
        id: '7',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/ont/pools/7',
        },
        attributes: {
          volume: 2.0,
          kit_barcode: 'barcode-1',
          concentration: 8.0,
          insert_size: 3362,
          created_at: '2024/08/13 07:35',
          updated_at: '2024/08/13 07:35',
          tube_barcode: 'TRAC-2-34',
          source_identifier: 'GEN-1723534534-1:F1, B2, F2-G2',
          final_library_amount: 7.2,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/7/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/7/tube',
            },
            data: {
              type: 'tubes',
              id: '34',
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
            ],
          },
        },
      },
      {
        id: '6',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/ont/pools/6',
        },
        attributes: {
          volume: 8.0,
          kit_barcode: 'barcode-0',
          concentration: 4.0,
          insert_size: 8018,
          created_at: '2024/08/13 07:35',
          updated_at: '2024/08/13 07:35',
          tube_barcode: 'TRAC-2-33',
          source_identifier: 'GEN-1723534534-1:G1-B2, D2, F2-G2',
          final_library_amount: 6.0,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/6/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/6/tube',
            },
            data: {
              type: 'tubes',
              id: '33',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/6/relationships/libraries',
              related: 'http://localhost:3100/v1/ont/pools/6/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '6',
              },
              {
                type: 'libraries',
                id: '7',
              },
              {
                type: 'libraries',
                id: '8',
              },
              {
                type: 'libraries',
                id: '9',
              },
              {
                type: 'libraries',
                id: '10',
              },
              {
                type: 'libraries',
                id: '11',
              },
              {
                type: 'libraries',
                id: '12',
              },
              {
                type: 'libraries',
                id: '13',
              },
            ],
          },
        },
      },
      {
        id: '5',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/ont/pools/5',
        },
        attributes: {
          volume: 10.0,
          kit_barcode: 'barcode-4',
          concentration: 7.0,
          insert_size: 5085,
          created_at: '2024/08/13 07:35',
          updated_at: '2024/08/13 07:35',
          tube_barcode: 'TRAC-2-32',
          source_identifier: 'GEN-1723534534-1:E1',
          final_library_amount: 20.9,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/5/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/5/tube',
            },
            data: {
              type: 'tubes',
              id: '32',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/5/relationships/libraries',
              related: 'http://localhost:3100/v1/ont/pools/5/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '5',
              },
            ],
          },
        },
      },
      {
        id: '4',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/ont/pools/4',
        },
        attributes: {
          volume: 1.0,
          kit_barcode: 'barcode-3',
          concentration: 7.0,
          insert_size: 9604,
          created_at: '2024/08/13 07:35',
          updated_at: '2024/08/13 07:35',
          tube_barcode: 'TRAC-2-31',
          source_identifier: 'GEN-1723534534-1:D1',
          final_library_amount: 1.1,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/4/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/4/tube',
            },
            data: {
              type: 'tubes',
              id: '31',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/4/relationships/libraries',
              related: 'http://localhost:3100/v1/ont/pools/4/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '4',
              },
            ],
          },
        },
      },
      {
        id: '3',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/ont/pools/3',
        },
        attributes: {
          volume: 4.0,
          kit_barcode: 'barcode-2',
          concentration: 4.0,
          insert_size: 6519,
          created_at: '2024/08/13 07:35',
          updated_at: '2024/08/13 07:35',
          tube_barcode: 'TRAC-2-30',
          source_identifier: 'GEN-1723534534-1:C1',
          final_library_amount: 3.7,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/3/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/3/tube',
            },
            data: {
              type: 'tubes',
              id: '30',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/3/relationships/libraries',
              related: 'http://localhost:3100/v1/ont/pools/3/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '3',
              },
            ],
          },
        },
      },
      {
        id: '2',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/ont/pools/2',
        },
        attributes: {
          volume: 3.0,
          kit_barcode: 'barcode-1',
          concentration: 3.0,
          insert_size: 3376,
          created_at: '2024/08/13 07:35',
          updated_at: '2024/08/13 07:35',
          tube_barcode: 'TRAC-2-29',
          source_identifier: 'GEN-1723534534-1:B1',
          final_library_amount: 4.0,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/2/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/2/tube',
            },
            data: {
              type: 'tubes',
              id: '29',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/2/relationships/libraries',
              related: 'http://localhost:3100/v1/ont/pools/2/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '2',
              },
            ],
          },
        },
      },
      {
        id: '1',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/ont/pools/1',
        },
        attributes: {
          volume: 7.0,
          kit_barcode: 'barcode-0',
          concentration: 6.0,
          insert_size: 7461,
          created_at: '2024/08/13 07:35',
          updated_at: '2024/08/13 07:35',
          tube_barcode: 'TRAC-2-28',
          source_identifier: 'GEN-1723534534-1:A1',
          final_library_amount: 8.5,
        },
        relationships: {
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/1/relationships/tube',
              related: 'http://localhost:3100/v1/ont/pools/1/tube',
            },
            data: {
              type: 'tubes',
              id: '28',
            },
          },
          libraries: {
            links: {
              self: 'http://localhost:3100/v1/ont/pools/1/relationships/libraries',
              related: 'http://localhost:3100/v1/ont/pools/1/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '1',
              },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '1',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/1',
        },
        attributes: {
          volume: 5.0,
          kit_barcode: 'barcode-0',
          concentration: 1.0,
          insert_size: 5882,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/1/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/1/request',
            },
            data: {
              type: 'requests',
              id: '1',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/1/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/1/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/1/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/1/tag',
            },
            data: null,
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/1/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/1/pool',
            },
            data: {
              type: 'pools',
              id: '1',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/1/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/1/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/1/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/1/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/1/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/1/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '2',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/2',
        },
        attributes: {
          volume: 7.0,
          kit_barcode: 'barcode-1',
          concentration: 9.0,
          insert_size: 6220,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/2/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/2/request',
            },
            data: {
              type: 'requests',
              id: '2',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/2/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/2/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/2/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/2/tag',
            },
            data: null,
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/2/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/2/pool',
            },
            data: {
              type: 'pools',
              id: '2',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/2/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/2/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/2/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/2/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/2/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/2/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '3',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/3',
        },
        attributes: {
          volume: 6.0,
          kit_barcode: 'barcode-2',
          concentration: 10.0,
          insert_size: 2711,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/3/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/3/request',
            },
            data: {
              type: 'requests',
              id: '3',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/3/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/3/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/3/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/3/tag',
            },
            data: null,
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/3/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/3/pool',
            },
            data: {
              type: 'pools',
              id: '3',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/3/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/3/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/3/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/3/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/3/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/3/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '4',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/4',
        },
        attributes: {
          volume: 1.0,
          kit_barcode: 'barcode-3',
          concentration: 1.0,
          insert_size: 6435,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/4/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/4/request',
            },
            data: {
              type: 'requests',
              id: '4',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/4/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/4/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/4/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/4/tag',
            },
            data: null,
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/4/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/4/pool',
            },
            data: {
              type: 'pools',
              id: '4',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/4/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/4/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/4/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/4/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/4/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/4/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '5',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/5',
        },
        attributes: {
          volume: 9.0,
          kit_barcode: 'barcode-4',
          concentration: 5.0,
          insert_size: 3754,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/5/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/5/request',
            },
            data: {
              type: 'requests',
              id: '5',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/5/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/5/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/5/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/5/tag',
            },
            data: null,
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/5/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/5/pool',
            },
            data: {
              type: 'pools',
              id: '5',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/5/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/5/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/5/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/5/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/5/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/5/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '6',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/6',
        },
        attributes: {
          volume: 3.0,
          kit_barcode: 'barcode-0',
          concentration: 1.0,
          insert_size: 6957,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/6/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/6/request',
            },
            data: {
              type: 'requests',
              id: '10',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/6/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/6/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/6/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/6/tag',
            },
            data: {
              type: 'tags',
              id: '389',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/6/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/6/pool',
            },
            data: {
              type: 'pools',
              id: '6',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/6/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/6/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/6/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/6/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/6/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/6/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '7',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/7',
        },
        attributes: {
          volume: 8.0,
          kit_barcode: 'barcode-0',
          concentration: 1.0,
          insert_size: 8086,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/7/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/7/request',
            },
            data: {
              type: 'requests',
              id: '8',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/7/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/7/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/7/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/7/tag',
            },
            data: {
              type: 'tags',
              id: '390',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/7/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/7/pool',
            },
            data: {
              type: 'pools',
              id: '6',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/7/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/7/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/7/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/7/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/7/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/7/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '8',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/8',
        },
        attributes: {
          volume: 4.0,
          kit_barcode: 'barcode-0',
          concentration: 2.0,
          insert_size: 7643,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/8/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/8/request',
            },
            data: {
              type: 'requests',
              id: '14',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/8/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/8/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/8/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/8/tag',
            },
            data: {
              type: 'tags',
              id: '391',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/8/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/8/pool',
            },
            data: {
              type: 'pools',
              id: '6',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/8/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/8/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/8/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/8/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/8/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/8/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '9',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/9',
        },
        attributes: {
          volume: 9.0,
          kit_barcode: 'barcode-0',
          concentration: 7.0,
          insert_size: 1437,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/9/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/9/request',
            },
            data: {
              type: 'requests',
              id: '12',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/9/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/9/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/9/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/9/tag',
            },
            data: {
              type: 'tags',
              id: '392',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/9/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/9/pool',
            },
            data: {
              type: 'pools',
              id: '6',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/9/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/9/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/9/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/9/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/9/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/9/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '10',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/10',
        },
        attributes: {
          volume: 10.0,
          kit_barcode: 'barcode-0',
          concentration: 10.0,
          insert_size: 3822,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/10/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/10/request',
            },
            data: {
              type: 'requests',
              id: '9',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/10/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/10/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/10/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/10/tag',
            },
            data: {
              type: 'tags',
              id: '393',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/10/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/10/pool',
            },
            data: {
              type: 'pools',
              id: '6',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/10/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/10/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/10/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/10/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/10/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/10/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '11',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/11',
        },
        attributes: {
          volume: 2.0,
          kit_barcode: 'barcode-0',
          concentration: 9.0,
          insert_size: 1227,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/11/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/11/request',
            },
            data: {
              type: 'requests',
              id: '7',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/11/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/11/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/11/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/11/tag',
            },
            data: {
              type: 'tags',
              id: '394',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/11/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/11/pool',
            },
            data: {
              type: 'pools',
              id: '6',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/11/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/11/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/11/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/11/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/11/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/11/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '12',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/12',
        },
        attributes: {
          volume: 4.0,
          kit_barcode: 'barcode-0',
          concentration: 1.0,
          insert_size: 7922,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/12/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/12/request',
            },
            data: {
              type: 'requests',
              id: '15',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/12/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/12/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/12/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/12/tag',
            },
            data: {
              type: 'tags',
              id: '395',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/12/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/12/pool',
            },
            data: {
              type: 'pools',
              id: '6',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/12/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/12/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/12/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/12/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/12/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/12/source_tube',
            },
            data: null,
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
          kit_barcode: 'barcode-0',
          concentration: 5.0,
          insert_size: 4082,
          created_at: '2024/08/13 07:35',
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
              id: '14',
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
              id: '396',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/13/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/13/pool',
            },
            data: {
              type: 'pools',
              id: '6',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/13/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/13/source_tube',
            },
            data: null,
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
          volume: 2.0,
          kit_barcode: 'barcode-1',
          concentration: 4.0,
          insert_size: 3908,
          created_at: '2024/08/13 07:35',
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
              id: '15',
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
              id: '389',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/14/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/14/source_tube',
            },
            data: null,
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
          volume: 9.0,
          kit_barcode: 'barcode-1',
          concentration: 4.0,
          insert_size: 7722,
          created_at: '2024/08/13 07:35',
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
              id: '10',
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
              id: '390',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/15/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/15/source_tube',
            },
            data: null,
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
          volume: 1.0,
          kit_barcode: 'barcode-1',
          concentration: 8.0,
          insert_size: 1986,
          created_at: '2024/08/13 07:35',
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
              id: '15',
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
              id: '391',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/16/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/16/source_tube',
            },
            data: null,
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
          volume: 2.0,
          kit_barcode: 'barcode-1',
          concentration: 3.0,
          insert_size: 3455,
          created_at: '2024/08/13 07:35',
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
              id: '15',
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
              id: '392',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/17/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/17/source_tube',
            },
            data: null,
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
          volume: 7.0,
          kit_barcode: 'barcode-1',
          concentration: 7.0,
          insert_size: 1860,
          created_at: '2024/08/13 07:35',
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
              id: '14',
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
              id: '393',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/18/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/18/pool',
            },
            data: {
              type: 'pools',
              id: '7',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/18/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/18/source_tube',
            },
            data: null,
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
          volume: 10.0,
          kit_barcode: 'barcode-1',
          concentration: 1.0,
          insert_size: 2558,
          created_at: '2024/08/13 07:35',
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
              id: '14',
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
              id: '394',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/19/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/19/pool',
            },
            data: {
              type: 'pools',
              id: '7',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/19/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/19/source_tube',
            },
            data: null,
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
          volume: 3.0,
          kit_barcode: 'barcode-1',
          concentration: 4.0,
          insert_size: 5859,
          created_at: '2024/08/13 07:35',
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
              id: '395',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/20/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/20/pool',
            },
            data: {
              type: 'pools',
              id: '7',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/20/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/20/source_tube',
            },
            data: null,
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
          volume: 10.0,
          kit_barcode: 'barcode-1',
          concentration: 1.0,
          insert_size: 3458,
          created_at: '2024/08/13 07:35',
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
              id: '14',
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
              id: '396',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/21/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/21/pool',
            },
            data: {
              type: 'pools',
              id: '7',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/21/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/21/source_tube',
            },
            data: null,
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
          volume: 7.0,
          kit_barcode: 'barcode-1',
          concentration: 8.0,
          insert_size: 6614,
          created_at: '2024/08/13 07:35',
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
              id: '6',
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
              id: '397',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/22/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/22/pool',
            },
            data: {
              type: 'pools',
              id: '7',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/22/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/22/source_tube',
            },
            data: null,
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
          volume: 8.0,
          kit_barcode: 'barcode-2',
          concentration: 2.0,
          insert_size: 3955,
          created_at: '2024/08/13 07:35',
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
              id: '14',
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
              id: '389',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/23/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/23/source_tube',
            },
            data: null,
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
          volume: 1.0,
          kit_barcode: 'barcode-3',
          concentration: 3.0,
          insert_size: 7962,
          created_at: '2024/08/13 07:35',
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
              id: '9',
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
              id: '389',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/24/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/24/pool',
            },
            data: {
              type: 'pools',
              id: '9',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/24/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/24/source_tube',
            },
            data: null,
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
          volume: 2.0,
          kit_barcode: 'barcode-3',
          concentration: 8.0,
          insert_size: 3221,
          created_at: '2024/08/13 07:35',
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
              id: '14',
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
              id: '390',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/25/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/25/source_tube',
            },
            data: null,
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
          volume: 1.0,
          kit_barcode: 'barcode-3',
          concentration: 6.0,
          insert_size: 1808,
          created_at: '2024/08/13 07:35',
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
              id: '6',
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
              id: '391',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/26/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/26/source_tube',
            },
            data: null,
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
          volume: 10.0,
          kit_barcode: 'barcode-3',
          concentration: 6.0,
          insert_size: 5613,
          created_at: '2024/08/13 07:35',
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
              id: '11',
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
              id: '392',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/27/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/27/source_tube',
            },
            data: null,
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
          volume: 5.0,
          kit_barcode: 'barcode-3',
          concentration: 10.0,
          insert_size: 3190,
          created_at: '2024/08/13 07:35',
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
              id: '6',
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
              id: '393',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/28/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/28/source_tube',
            },
            data: null,
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
          volume: 6.0,
          kit_barcode: 'barcode-3',
          concentration: 3.0,
          insert_size: 7244,
          created_at: '2024/08/13 07:35',
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
              id: '6',
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
              id: '394',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/29/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/29/source_tube',
            },
            data: null,
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
          volume: 10.0,
          kit_barcode: 'barcode-3',
          concentration: 1.0,
          insert_size: 3453,
          created_at: '2024/08/13 07:35',
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
              id: '14',
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
              id: '395',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/30/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/30/source_tube',
            },
            data: null,
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
          volume: 6.0,
          kit_barcode: 'barcode-3',
          concentration: 1.0,
          insert_size: 5145,
          created_at: '2024/08/13 07:35',
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
              id: '9',
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
              id: '396',
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
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/31/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/31/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '32',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/32',
        },
        attributes: {
          volume: 6.0,
          kit_barcode: 'barcode-3',
          concentration: 4.0,
          insert_size: 9186,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/32/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/32/request',
            },
            data: {
              type: 'requests',
              id: '8',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/32/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/32/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/32/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/32/tag',
            },
            data: {
              type: 'tags',
              id: '397',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/32/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/32/pool',
            },
            data: {
              type: 'pools',
              id: '9',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/32/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/32/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/32/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/32/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/32/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/32/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '33',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/33',
        },
        attributes: {
          volume: 9.0,
          kit_barcode: 'barcode-3',
          concentration: 10.0,
          insert_size: 6556,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/33/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/33/request',
            },
            data: {
              type: 'requests',
              id: '6',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/33/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/33/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/33/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/33/tag',
            },
            data: {
              type: 'tags',
              id: '398',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/33/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/33/pool',
            },
            data: {
              type: 'pools',
              id: '9',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/33/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/33/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/33/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/33/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/33/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/33/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '34',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/34',
        },
        attributes: {
          volume: 8.0,
          kit_barcode: 'barcode-4',
          concentration: 4.0,
          insert_size: 3818,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/34/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/34/request',
            },
            data: {
              type: 'requests',
              id: '11',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/34/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/34/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/34/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/34/tag',
            },
            data: {
              type: 'tags',
              id: '389',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/34/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/34/pool',
            },
            data: {
              type: 'pools',
              id: '10',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/34/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/34/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/34/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/34/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/34/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/34/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '35',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/35',
        },
        attributes: {
          volume: 4.0,
          kit_barcode: 'barcode-5',
          concentration: 2.0,
          insert_size: 5364,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/35/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/35/request',
            },
            data: {
              type: 'requests',
              id: '12',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/35/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/35/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/35/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/35/tag',
            },
            data: {
              type: 'tags',
              id: '389',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/35/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/35/pool',
            },
            data: {
              type: 'pools',
              id: '11',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/35/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/35/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/35/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/35/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/35/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/35/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '36',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/36',
        },
        attributes: {
          volume: 7.0,
          kit_barcode: 'barcode-5',
          concentration: 6.0,
          insert_size: 3089,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/36/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/36/request',
            },
            data: {
              type: 'requests',
              id: '6',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/36/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/36/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/36/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/36/tag',
            },
            data: {
              type: 'tags',
              id: '390',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/36/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/36/pool',
            },
            data: {
              type: 'pools',
              id: '11',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/36/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/36/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/36/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/36/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/36/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/36/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '37',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/37',
        },
        attributes: {
          volume: 10.0,
          kit_barcode: 'barcode-5',
          concentration: 8.0,
          insert_size: 5513,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/37/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/37/request',
            },
            data: {
              type: 'requests',
              id: '14',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/37/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/37/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/37/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/37/tag',
            },
            data: {
              type: 'tags',
              id: '391',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/37/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/37/pool',
            },
            data: {
              type: 'pools',
              id: '11',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/37/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/37/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/37/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/37/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/37/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/37/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '38',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/38',
        },
        attributes: {
          volume: 6.0,
          kit_barcode: 'barcode-5',
          concentration: 3.0,
          insert_size: 6908,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/38/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/38/request',
            },
            data: {
              type: 'requests',
              id: '11',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/38/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/38/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/38/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/38/tag',
            },
            data: {
              type: 'tags',
              id: '392',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/38/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/38/pool',
            },
            data: {
              type: 'pools',
              id: '11',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/38/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/38/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/38/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/38/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/38/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/38/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '39',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/39',
        },
        attributes: {
          volume: 7.0,
          kit_barcode: 'barcode-5',
          concentration: 10.0,
          insert_size: 1334,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/39/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/39/request',
            },
            data: {
              type: 'requests',
              id: '10',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/39/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/39/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/39/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/39/tag',
            },
            data: {
              type: 'tags',
              id: '393',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/39/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/39/pool',
            },
            data: {
              type: 'pools',
              id: '11',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/39/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/39/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/39/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/39/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/39/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/39/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '40',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/40',
        },
        attributes: {
          volume: 6.0,
          kit_barcode: 'barcode-5',
          concentration: 1.0,
          insert_size: 4621,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/40/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/40/request',
            },
            data: {
              type: 'requests',
              id: '8',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/40/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/40/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/40/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/40/tag',
            },
            data: {
              type: 'tags',
              id: '394',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/40/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/40/pool',
            },
            data: {
              type: 'pools',
              id: '11',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/40/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/40/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/40/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/40/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/40/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/40/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '41',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/41',
        },
        attributes: {
          volume: 10.0,
          kit_barcode: 'barcode-5',
          concentration: 9.0,
          insert_size: 8261,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/41/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/41/request',
            },
            data: {
              type: 'requests',
              id: '6',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/41/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/41/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/41/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/41/tag',
            },
            data: {
              type: 'tags',
              id: '395',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/41/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/41/pool',
            },
            data: {
              type: 'pools',
              id: '11',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/41/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/41/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/41/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/41/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/41/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/41/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '42',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/42',
        },
        attributes: {
          volume: 7.0,
          kit_barcode: 'barcode-5',
          concentration: 10.0,
          insert_size: 3048,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/42/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/42/request',
            },
            data: {
              type: 'requests',
              id: '10',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/42/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/42/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/42/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/42/tag',
            },
            data: {
              type: 'tags',
              id: '396',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/42/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/42/pool',
            },
            data: {
              type: 'pools',
              id: '11',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/42/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/42/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/42/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/42/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/42/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/42/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '43',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/43',
        },
        attributes: {
          volume: 3.0,
          kit_barcode: 'barcode-5',
          concentration: 4.0,
          insert_size: 9840,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/43/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/43/request',
            },
            data: {
              type: 'requests',
              id: '7',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/43/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/43/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/43/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/43/tag',
            },
            data: {
              type: 'tags',
              id: '397',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/43/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/43/pool',
            },
            data: {
              type: 'pools',
              id: '11',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/43/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/43/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/43/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/43/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/43/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/43/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '44',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/44',
        },
        attributes: {
          volume: 1.0,
          kit_barcode: 'barcode-6',
          concentration: 4.0,
          insert_size: 2923,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/44/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/44/request',
            },
            data: {
              type: 'requests',
              id: '15',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/44/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/44/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/44/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/44/tag',
            },
            data: {
              type: 'tags',
              id: '389',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/44/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/44/pool',
            },
            data: {
              type: 'pools',
              id: '12',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/44/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/44/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/44/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/44/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/44/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/44/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '45',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/45',
        },
        attributes: {
          volume: 5.0,
          kit_barcode: 'barcode-6',
          concentration: 4.0,
          insert_size: 1772,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/45/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/45/request',
            },
            data: {
              type: 'requests',
              id: '12',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/45/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/45/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/45/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/45/tag',
            },
            data: {
              type: 'tags',
              id: '390',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/45/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/45/pool',
            },
            data: {
              type: 'pools',
              id: '12',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/45/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/45/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/45/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/45/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/45/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/45/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '46',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/46',
        },
        attributes: {
          volume: 1.0,
          kit_barcode: 'barcode-6',
          concentration: 7.0,
          insert_size: 3569,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/46/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/46/request',
            },
            data: {
              type: 'requests',
              id: '7',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/46/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/46/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/46/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/46/tag',
            },
            data: {
              type: 'tags',
              id: '391',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/46/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/46/pool',
            },
            data: {
              type: 'pools',
              id: '12',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/46/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/46/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/46/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/46/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/46/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/46/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '47',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/47',
        },
        attributes: {
          volume: 4.0,
          kit_barcode: 'barcode-6',
          concentration: 9.0,
          insert_size: 4827,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/47/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/47/request',
            },
            data: {
              type: 'requests',
              id: '7',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/47/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/47/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/47/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/47/tag',
            },
            data: {
              type: 'tags',
              id: '392',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/47/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/47/pool',
            },
            data: {
              type: 'pools',
              id: '12',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/47/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/47/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/47/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/47/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/47/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/47/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '48',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/48',
        },
        attributes: {
          volume: 9.0,
          kit_barcode: 'barcode-7',
          concentration: 4.0,
          insert_size: 1423,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/48/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/48/request',
            },
            data: {
              type: 'requests',
              id: '15',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/48/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/48/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/48/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/48/tag',
            },
            data: {
              type: 'tags',
              id: '389',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/48/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/48/pool',
            },
            data: {
              type: 'pools',
              id: '13',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/48/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/48/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/48/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/48/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/48/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/48/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '49',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/49',
        },
        attributes: {
          volume: 7.0,
          kit_barcode: 'barcode-8',
          concentration: 8.0,
          insert_size: 4868,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/49/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/49/request',
            },
            data: {
              type: 'requests',
              id: '8',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/49/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/49/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/49/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/49/tag',
            },
            data: {
              type: 'tags',
              id: '389',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/49/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/49/pool',
            },
            data: {
              type: 'pools',
              id: '14',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/49/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/49/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/49/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/49/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/49/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/49/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '50',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/50',
        },
        attributes: {
          volume: 8.0,
          kit_barcode: 'barcode-8',
          concentration: 7.0,
          insert_size: 1857,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/50/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/50/request',
            },
            data: {
              type: 'requests',
              id: '14',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/50/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/50/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/50/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/50/tag',
            },
            data: {
              type: 'tags',
              id: '390',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/50/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/50/pool',
            },
            data: {
              type: 'pools',
              id: '14',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/50/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/50/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/50/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/50/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/50/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/50/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '51',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/51',
        },
        attributes: {
          volume: 3.0,
          kit_barcode: 'barcode-8',
          concentration: 9.0,
          insert_size: 6671,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/51/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/51/request',
            },
            data: {
              type: 'requests',
              id: '6',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/51/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/51/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/51/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/51/tag',
            },
            data: {
              type: 'tags',
              id: '391',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/51/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/51/pool',
            },
            data: {
              type: 'pools',
              id: '14',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/51/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/51/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/51/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/51/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/51/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/51/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '52',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/52',
        },
        attributes: {
          volume: 6.0,
          kit_barcode: 'barcode-8',
          concentration: 9.0,
          insert_size: 5903,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/52/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/52/request',
            },
            data: {
              type: 'requests',
              id: '14',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/52/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/52/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/52/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/52/tag',
            },
            data: {
              type: 'tags',
              id: '392',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/52/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/52/pool',
            },
            data: {
              type: 'pools',
              id: '14',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/52/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/52/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/52/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/52/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/52/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/52/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '53',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/53',
        },
        attributes: {
          volume: 7.0,
          kit_barcode: 'barcode-8',
          concentration: 10.0,
          insert_size: 7464,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/53/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/53/request',
            },
            data: {
              type: 'requests',
              id: '6',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/53/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/53/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/53/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/53/tag',
            },
            data: {
              type: 'tags',
              id: '393',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/53/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/53/pool',
            },
            data: {
              type: 'pools',
              id: '14',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/53/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/53/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/53/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/53/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/53/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/53/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '54',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/54',
        },
        attributes: {
          volume: 7.0,
          kit_barcode: 'barcode-9',
          concentration: 5.0,
          insert_size: 3717,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/54/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/54/request',
            },
            data: {
              type: 'requests',
              id: '8',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/54/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/54/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/54/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/54/tag',
            },
            data: {
              type: 'tags',
              id: '389',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/54/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/54/pool',
            },
            data: {
              type: 'pools',
              id: '15',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/54/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/54/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/54/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/54/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/54/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/54/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '55',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/55',
        },
        attributes: {
          volume: 8.0,
          kit_barcode: 'barcode-9',
          concentration: 9.0,
          insert_size: 3910,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/55/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/55/request',
            },
            data: {
              type: 'requests',
              id: '12',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/55/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/55/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/55/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/55/tag',
            },
            data: {
              type: 'tags',
              id: '390',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/55/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/55/pool',
            },
            data: {
              type: 'pools',
              id: '15',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/55/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/55/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/55/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/55/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/55/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/55/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '56',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/56',
        },
        attributes: {
          volume: 10.0,
          kit_barcode: 'barcode-9',
          concentration: 3.0,
          insert_size: 1308,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/56/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/56/request',
            },
            data: {
              type: 'requests',
              id: '8',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/56/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/56/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/56/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/56/tag',
            },
            data: {
              type: 'tags',
              id: '391',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/56/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/56/pool',
            },
            data: {
              type: 'pools',
              id: '15',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/56/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/56/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/56/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/56/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/56/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/56/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '57',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/57',
        },
        attributes: {
          volume: 1.0,
          kit_barcode: 'barcode-9',
          concentration: 4.0,
          insert_size: 6506,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/57/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/57/request',
            },
            data: {
              type: 'requests',
              id: '8',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/57/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/57/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/57/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/57/tag',
            },
            data: {
              type: 'tags',
              id: '392',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/57/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/57/pool',
            },
            data: {
              type: 'pools',
              id: '15',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/57/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/57/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/57/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/57/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/57/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/57/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '58',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/58',
        },
        attributes: {
          volume: 8.0,
          kit_barcode: 'barcode-9',
          concentration: 4.0,
          insert_size: 1791,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/58/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/58/request',
            },
            data: {
              type: 'requests',
              id: '13',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/58/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/58/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/58/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/58/tag',
            },
            data: {
              type: 'tags',
              id: '393',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/58/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/58/pool',
            },
            data: {
              type: 'pools',
              id: '15',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/58/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/58/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/58/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/58/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/58/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/58/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '59',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/59',
        },
        attributes: {
          volume: 10.0,
          kit_barcode: 'barcode-9',
          concentration: 6.0,
          insert_size: 3683,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/59/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/59/request',
            },
            data: {
              type: 'requests',
              id: '9',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/59/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/59/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/59/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/59/tag',
            },
            data: {
              type: 'tags',
              id: '394',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/59/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/59/pool',
            },
            data: {
              type: 'pools',
              id: '15',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/59/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/59/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/59/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/59/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/59/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/59/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '60',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/60',
        },
        attributes: {
          volume: 5.0,
          kit_barcode: 'barcode-9',
          concentration: 4.0,
          insert_size: 2787,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/60/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/60/request',
            },
            data: {
              type: 'requests',
              id: '11',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/60/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/60/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/60/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/60/tag',
            },
            data: {
              type: 'tags',
              id: '395',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/60/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/60/pool',
            },
            data: {
              type: 'pools',
              id: '15',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/60/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/60/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/60/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/60/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/60/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/60/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '61',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/61',
        },
        attributes: {
          volume: 1.0,
          kit_barcode: 'barcode-9',
          concentration: 3.0,
          insert_size: 5222,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/61/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/61/request',
            },
            data: {
              type: 'requests',
              id: '8',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/61/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/61/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/61/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/61/tag',
            },
            data: {
              type: 'tags',
              id: '396',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/61/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/61/pool',
            },
            data: {
              type: 'pools',
              id: '15',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/61/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/61/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/61/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/61/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/61/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/61/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '62',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/62',
        },
        attributes: {
          volume: 7.0,
          kit_barcode: 'barcode-9',
          concentration: 9.0,
          insert_size: 9379,
          created_at: '2024/08/13 07:35',
          deactivated_at: null,
          state: 'pending',
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/62/relationships/request',
              related: 'http://localhost:3100/v1/ont/libraries/62/request',
            },
            data: {
              type: 'requests',
              id: '8',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/62/relationships/tube',
              related: 'http://localhost:3100/v1/ont/libraries/62/tube',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/62/relationships/tag',
              related: 'http://localhost:3100/v1/ont/libraries/62/tag',
            },
            data: {
              type: 'tags',
              id: '397',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/62/relationships/pool',
              related: 'http://localhost:3100/v1/ont/libraries/62/pool',
            },
            data: {
              type: 'pools',
              id: '15',
            },
          },
          source_well: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/62/relationships/source_well',
              related: 'http://localhost:3100/v1/ont/libraries/62/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/62/relationships/source_plate',
              related: 'http://localhost:3100/v1/ont/libraries/62/source_plate',
            },
            data: {
              type: 'plates',
              id: '6',
            },
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/62/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/62/source_tube',
            },
            data: null,
          },
        },
      },
      {
        id: '389',
        type: 'tags',
        attributes: {
          oligo: 'CACAAAGACACCGACAACTTTCTT',
          group_id: 'NB01',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '390',
        type: 'tags',
        attributes: {
          oligo: 'ACAGACGACTACAAACGGAATCGA',
          group_id: 'NB02',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '391',
        type: 'tags',
        attributes: {
          oligo: 'CCTGGTAACTGGGACACAAGACTC',
          group_id: 'NB03',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '392',
        type: 'tags',
        attributes: {
          oligo: 'TAGGGAAACACGATAGAATCCGAA',
          group_id: 'NB04',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '393',
        type: 'tags',
        attributes: {
          oligo: 'AAGGTTACACAAACCCTGGACAAG',
          group_id: 'NB05',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '394',
        type: 'tags',
        attributes: {
          oligo: 'GACTACTTTCTGCCTTTGCGAGAA',
          group_id: 'NB06',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '395',
        type: 'tags',
        attributes: {
          oligo: 'AAGGATTCATTCCCACGGTAACAC',
          group_id: 'NB07',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '396',
        type: 'tags',
        attributes: {
          oligo: 'ACGTAACTTGGTTTGTTCCCTGAA',
          group_id: 'NB08',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '397',
        type: 'tags',
        attributes: {
          oligo: 'AACCAAGACTCGCTGTGCCTAGTT',
          group_id: 'NB09',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '398',
        type: 'tags',
        attributes: {
          oligo: 'GAGAGGACAAAGGTTTCAACGCTT',
          group_id: 'NB10',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '9',
            },
          },
        },
      },
      {
        id: '9',
        type: 'tag_sets',
        links: {
          self: 'http://localhost:3100/v1/ont/tag_sets/9',
        },
        attributes: {
          name: 'SQK-NBD114.96',
          uuid: null,
          pipeline: 'ont',
        },
        relationships: {
          tags: {
            links: {
              self: 'http://localhost:3100/v1/ont/tag_sets/9/relationships/tags',
              related: 'http://localhost:3100/v1/ont/tag_sets/9/tags',
            },
            data: [
              {
                type: 'tags',
                id: '389',
              },
              {
                type: 'tags',
                id: '390',
              },
              {
                type: 'tags',
                id: '391',
              },
              {
                type: 'tags',
                id: '392',
              },
              {
                type: 'tags',
                id: '393',
              },
              {
                type: 'tags',
                id: '394',
              },
              {
                type: 'tags',
                id: '395',
              },
              {
                type: 'tags',
                id: '396',
              },
              {
                type: 'tags',
                id: '397',
              },
              {
                type: 'tags',
                id: '398',
              },
            ],
          },
        },
      },
      {
        id: '6',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/ont/plates/6',
        },
        attributes: {
          barcode: 'GEN-1723534534-1',
          created_at: '2024/08/13 07:35',
        },
        relationships: {
          wells: {
            links: {
              self: 'http://localhost:3100/v1/ont/plates/6/relationships/wells',
              related: 'http://localhost:3100/v1/ont/plates/6/wells',
            },
            data: [
              {
                type: 'wells',
                id: '241',
              },
              {
                type: 'wells',
                id: '242',
              },
              {
                type: 'wells',
                id: '243',
              },
              {
                type: 'wells',
                id: '244',
              },
              {
                type: 'wells',
                id: '245',
              },
              {
                type: 'wells',
                id: '246',
              },
              {
                type: 'wells',
                id: '247',
              },
              {
                type: 'wells',
                id: '248',
              },
              {
                type: 'wells',
                id: '249',
              },
              {
                type: 'wells',
                id: '250',
              },
              {
                type: 'wells',
                id: '251',
              },
              {
                type: 'wells',
                id: '252',
              },
              {
                type: 'wells',
                id: '253',
              },
              {
                type: 'wells',
                id: '254',
              },
              {
                type: 'wells',
                id: '255',
              },
              {
                type: 'wells',
                id: '256',
              },
              {
                type: 'wells',
                id: '257',
              },
              {
                type: 'wells',
                id: '258',
              },
              {
                type: 'wells',
                id: '259',
              },
              {
                type: 'wells',
                id: '260',
              },
              {
                type: 'wells',
                id: '261',
              },
              {
                type: 'wells',
                id: '262',
              },
              {
                type: 'wells',
                id: '263',
              },
              {
                type: 'wells',
                id: '264',
              },
              {
                type: 'wells',
                id: '265',
              },
              {
                type: 'wells',
                id: '266',
              },
              {
                type: 'wells',
                id: '267',
              },
              {
                type: 'wells',
                id: '268',
              },
              {
                type: 'wells',
                id: '269',
              },
              {
                type: 'wells',
                id: '270',
              },
              {
                type: 'wells',
                id: '271',
              },
              {
                type: 'wells',
                id: '272',
              },
              {
                type: 'wells',
                id: '273',
              },
              {
                type: 'wells',
                id: '274',
              },
              {
                type: 'wells',
                id: '275',
              },
              {
                type: 'wells',
                id: '276',
              },
              {
                type: 'wells',
                id: '277',
              },
              {
                type: 'wells',
                id: '278',
              },
              {
                type: 'wells',
                id: '279',
              },
              {
                type: 'wells',
                id: '280',
              },
              {
                type: 'wells',
                id: '281',
              },
              {
                type: 'wells',
                id: '282',
              },
              {
                type: 'wells',
                id: '283',
              },
              {
                type: 'wells',
                id: '284',
              },
              {
                type: 'wells',
                id: '285',
              },
              {
                type: 'wells',
                id: '286',
              },
              {
                type: 'wells',
                id: '287',
              },
              {
                type: 'wells',
                id: '288',
              },
              {
                type: 'wells',
                id: '289',
              },
              {
                type: 'wells',
                id: '290',
              },
              {
                type: 'wells',
                id: '291',
              },
              {
                type: 'wells',
                id: '292',
              },
              {
                type: 'wells',
                id: '293',
              },
              {
                type: 'wells',
                id: '294',
              },
              {
                type: 'wells',
                id: '295',
              },
              {
                type: 'wells',
                id: '296',
              },
              {
                type: 'wells',
                id: '297',
              },
              {
                type: 'wells',
                id: '298',
              },
              {
                type: 'wells',
                id: '299',
              },
              {
                type: 'wells',
                id: '300',
              },
              {
                type: 'wells',
                id: '301',
              },
              {
                type: 'wells',
                id: '302',
              },
              {
                type: 'wells',
                id: '303',
              },
              {
                type: 'wells',
                id: '304',
              },
              {
                type: 'wells',
                id: '305',
              },
              {
                type: 'wells',
                id: '306',
              },
              {
                type: 'wells',
                id: '307',
              },
              {
                type: 'wells',
                id: '308',
              },
              {
                type: 'wells',
                id: '309',
              },
              {
                type: 'wells',
                id: '310',
              },
              {
                type: 'wells',
                id: '311',
              },
              {
                type: 'wells',
                id: '312',
              },
              {
                type: 'wells',
                id: '313',
              },
              {
                type: 'wells',
                id: '314',
              },
              {
                type: 'wells',
                id: '315',
              },
              {
                type: 'wells',
                id: '316',
              },
              {
                type: 'wells',
                id: '317',
              },
              {
                type: 'wells',
                id: '318',
              },
              {
                type: 'wells',
                id: '319',
              },
              {
                type: 'wells',
                id: '320',
              },
              {
                type: 'wells',
                id: '321',
              },
              {
                type: 'wells',
                id: '322',
              },
              {
                type: 'wells',
                id: '323',
              },
              {
                type: 'wells',
                id: '324',
              },
              {
                type: 'wells',
                id: '325',
              },
              {
                type: 'wells',
                id: '326',
              },
              {
                type: 'wells',
                id: '327',
              },
              {
                type: 'wells',
                id: '328',
              },
              {
                type: 'wells',
                id: '329',
              },
              {
                type: 'wells',
                id: '330',
              },
              {
                type: 'wells',
                id: '331',
              },
              {
                type: 'wells',
                id: '332',
              },
              {
                type: 'wells',
                id: '333',
              },
              {
                type: 'wells',
                id: '334',
              },
              {
                type: 'wells',
                id: '335',
              },
            ],
          },
        },
      },
      {
        id: '241',
        type: 'wells',
        attributes: {
          position: 'A1',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '1',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '242',
        type: 'wells',
        attributes: {
          position: 'B1',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '2',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '243',
        type: 'wells',
        attributes: {
          position: 'C1',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '3',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '244',
        type: 'wells',
        attributes: {
          position: 'D1',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '4',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '245',
        type: 'wells',
        attributes: {
          position: 'E1',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '5',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '246',
        type: 'wells',
        attributes: {
          position: 'F1',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '6',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '247',
        type: 'wells',
        attributes: {
          position: 'G1',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '7',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '248',
        type: 'wells',
        attributes: {
          position: 'H1',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '8',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '249',
        type: 'wells',
        attributes: {
          position: 'A2',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '9',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '250',
        type: 'wells',
        attributes: {
          position: 'B2',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '10',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '251',
        type: 'wells',
        attributes: {
          position: 'C2',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '11',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '252',
        type: 'wells',
        attributes: {
          position: 'D2',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '12',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '253',
        type: 'wells',
        attributes: {
          position: 'E2',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '13',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '254',
        type: 'wells',
        attributes: {
          position: 'F2',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '14',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '255',
        type: 'wells',
        attributes: {
          position: 'G2',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '15',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '256',
        type: 'wells',
        attributes: {
          position: 'H2',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '16',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '257',
        type: 'wells',
        attributes: {
          position: 'A3',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '17',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '258',
        type: 'wells',
        attributes: {
          position: 'B3',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '18',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '259',
        type: 'wells',
        attributes: {
          position: 'C3',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '19',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '260',
        type: 'wells',
        attributes: {
          position: 'D3',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '20',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '261',
        type: 'wells',
        attributes: {
          position: 'E3',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '21',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '262',
        type: 'wells',
        attributes: {
          position: 'F3',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '22',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '263',
        type: 'wells',
        attributes: {
          position: 'G3',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '23',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '264',
        type: 'wells',
        attributes: {
          position: 'H3',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '24',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '265',
        type: 'wells',
        attributes: {
          position: 'A4',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '25',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '266',
        type: 'wells',
        attributes: {
          position: 'B4',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '26',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '267',
        type: 'wells',
        attributes: {
          position: 'C4',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '27',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '268',
        type: 'wells',
        attributes: {
          position: 'D4',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '28',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '269',
        type: 'wells',
        attributes: {
          position: 'E4',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '29',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '270',
        type: 'wells',
        attributes: {
          position: 'F4',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '30',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '271',
        type: 'wells',
        attributes: {
          position: 'G4',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '31',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '272',
        type: 'wells',
        attributes: {
          position: 'H4',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '32',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '273',
        type: 'wells',
        attributes: {
          position: 'A5',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '33',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '274',
        type: 'wells',
        attributes: {
          position: 'B5',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '34',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '275',
        type: 'wells',
        attributes: {
          position: 'C5',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '35',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '276',
        type: 'wells',
        attributes: {
          position: 'D5',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '36',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '277',
        type: 'wells',
        attributes: {
          position: 'E5',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '37',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '278',
        type: 'wells',
        attributes: {
          position: 'F5',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '38',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '279',
        type: 'wells',
        attributes: {
          position: 'G5',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '39',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '280',
        type: 'wells',
        attributes: {
          position: 'H5',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '40',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '281',
        type: 'wells',
        attributes: {
          position: 'A6',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '41',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '282',
        type: 'wells',
        attributes: {
          position: 'B6',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '42',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '283',
        type: 'wells',
        attributes: {
          position: 'C6',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '43',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '284',
        type: 'wells',
        attributes: {
          position: 'D6',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '44',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '285',
        type: 'wells',
        attributes: {
          position: 'E6',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '45',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '286',
        type: 'wells',
        attributes: {
          position: 'F6',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '46',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '287',
        type: 'wells',
        attributes: {
          position: 'G6',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '47',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '288',
        type: 'wells',
        attributes: {
          position: 'H6',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '48',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '289',
        type: 'wells',
        attributes: {
          position: 'A7',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '49',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '290',
        type: 'wells',
        attributes: {
          position: 'B7',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '50',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '291',
        type: 'wells',
        attributes: {
          position: 'C7',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '51',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '292',
        type: 'wells',
        attributes: {
          position: 'D7',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '52',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '293',
        type: 'wells',
        attributes: {
          position: 'E7',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '53',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '294',
        type: 'wells',
        attributes: {
          position: 'F7',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '54',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '295',
        type: 'wells',
        attributes: {
          position: 'G7',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '55',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '296',
        type: 'wells',
        attributes: {
          position: 'H7',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '56',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '297',
        type: 'wells',
        attributes: {
          position: 'A8',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '57',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '298',
        type: 'wells',
        attributes: {
          position: 'B8',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '58',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '299',
        type: 'wells',
        attributes: {
          position: 'C8',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '59',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '300',
        type: 'wells',
        attributes: {
          position: 'D8',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '60',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '301',
        type: 'wells',
        attributes: {
          position: 'E8',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '61',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '302',
        type: 'wells',
        attributes: {
          position: 'F8',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '62',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '303',
        type: 'wells',
        attributes: {
          position: 'G8',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '63',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '304',
        type: 'wells',
        attributes: {
          position: 'H8',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '64',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '305',
        type: 'wells',
        attributes: {
          position: 'A9',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '65',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '306',
        type: 'wells',
        attributes: {
          position: 'B9',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '66',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '307',
        type: 'wells',
        attributes: {
          position: 'C9',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '67',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '308',
        type: 'wells',
        attributes: {
          position: 'D9',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '68',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '309',
        type: 'wells',
        attributes: {
          position: 'E9',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '69',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '310',
        type: 'wells',
        attributes: {
          position: 'F9',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '70',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '311',
        type: 'wells',
        attributes: {
          position: 'G9',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '71',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '312',
        type: 'wells',
        attributes: {
          position: 'H9',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '72',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '313',
        type: 'wells',
        attributes: {
          position: 'A10',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '73',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '314',
        type: 'wells',
        attributes: {
          position: 'B10',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '74',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '315',
        type: 'wells',
        attributes: {
          position: 'C10',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '75',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '316',
        type: 'wells',
        attributes: {
          position: 'D10',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '76',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '317',
        type: 'wells',
        attributes: {
          position: 'E10',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '77',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '318',
        type: 'wells',
        attributes: {
          position: 'F10',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '78',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '319',
        type: 'wells',
        attributes: {
          position: 'G10',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '79',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '320',
        type: 'wells',
        attributes: {
          position: 'H10',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '80',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '321',
        type: 'wells',
        attributes: {
          position: 'A11',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '81',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '322',
        type: 'wells',
        attributes: {
          position: 'B11',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '82',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '323',
        type: 'wells',
        attributes: {
          position: 'C11',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '83',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '324',
        type: 'wells',
        attributes: {
          position: 'D11',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '84',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '325',
        type: 'wells',
        attributes: {
          position: 'E11',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '85',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '326',
        type: 'wells',
        attributes: {
          position: 'F11',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '86',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '327',
        type: 'wells',
        attributes: {
          position: 'G11',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '87',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '328',
        type: 'wells',
        attributes: {
          position: 'H11',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '88',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '329',
        type: 'wells',
        attributes: {
          position: 'A12',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '89',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '330',
        type: 'wells',
        attributes: {
          position: 'B12',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '90',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '331',
        type: 'wells',
        attributes: {
          position: 'C12',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '91',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '332',
        type: 'wells',
        attributes: {
          position: 'D12',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '92',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '333',
        type: 'wells',
        attributes: {
          position: 'E12',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '93',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '334',
        type: 'wells',
        attributes: {
          position: 'F12',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '94',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '335',
        type: 'wells',
        attributes: {
          position: 'G12',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '95',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '6',
            },
          },
        },
      },
      {
        id: '95',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/95',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10094',
          external_study_id: '02b50d1f-cb27-4208-a7bd-09fd4b0a572c',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-95',
          source_identifier: 'GEN-1723534534-1:G12',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '94',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/94',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10093',
          external_study_id: '17a3fed5-736d-4b72-ba55-102b4788fd42',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-94',
          source_identifier: 'GEN-1723534534-1:F12',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '93',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/93',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10092',
          external_study_id: '37b13a1c-c877-4e46-9a97-c0dcda2cc6db',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-93',
          source_identifier: 'GEN-1723534534-1:E12',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '92',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/92',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10091',
          external_study_id: 'b4cc5546-7a14-4c32-9f6a-01e3cb2a32fc',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-92',
          source_identifier: 'GEN-1723534534-1:D12',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '91',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/91',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10090',
          external_study_id: '9de51cde-8255-4616-9b3e-088c9ee0c3b2',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-91',
          source_identifier: 'GEN-1723534534-1:C12',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '90',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/90',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10089',
          external_study_id: 'e3232b5a-45d8-4a15-8c20-042c6b7ff9e8',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-90',
          source_identifier: 'GEN-1723534534-1:B12',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '89',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/89',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10088',
          external_study_id: 'af056284-a922-4eff-a007-0c02831a2db5',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-89',
          source_identifier: 'GEN-1723534534-1:A12',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '88',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/88',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10087',
          external_study_id: '467468b3-17bb-4124-aeff-3628f3fc8673',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-88',
          source_identifier: 'GEN-1723534534-1:H11',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '87',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/87',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10086',
          external_study_id: '8ba21b4b-c0d7-4987-ab0f-7978c2c2f678',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-87',
          source_identifier: 'GEN-1723534534-1:G11',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '86',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/86',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10085',
          external_study_id: 'da41558d-6e68-497f-8039-ec87913f7c35',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-86',
          source_identifier: 'GEN-1723534534-1:F11',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '85',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/85',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10084',
          external_study_id: '56c38d7b-7995-498a-bfde-21b18e6f3148',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-85',
          source_identifier: 'GEN-1723534534-1:E11',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '84',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/84',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10083',
          external_study_id: '8fae535d-6b7d-4ad8-b455-0614e41cbc0e',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-84',
          source_identifier: 'GEN-1723534534-1:D11',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '83',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/83',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10082',
          external_study_id: 'c143a305-0dbc-4192-b787-90978cf86a9d',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-83',
          source_identifier: 'GEN-1723534534-1:C11',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '82',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/82',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10081',
          external_study_id: 'eeac16ba-7365-47f9-917e-ac244e532679',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-82',
          source_identifier: 'GEN-1723534534-1:B11',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '81',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/81',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10080',
          external_study_id: 'a7817c9c-f6d6-41a8-96bc-104fbe80ebb6',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-81',
          source_identifier: 'GEN-1723534534-1:A11',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '80',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/80',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10079',
          external_study_id: 'ff4f9423-1c6e-4f3f-aae0-9d586b01f7a4',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-80',
          source_identifier: 'GEN-1723534534-1:H10',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '79',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/79',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10078',
          external_study_id: '444cbe33-9859-457a-b5fb-a672a257a4bf',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-79',
          source_identifier: 'GEN-1723534534-1:G10',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '78',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/78',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10077',
          external_study_id: '1041a75a-d4d2-48dc-8c3a-2e6ef67160ff',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-78',
          source_identifier: 'GEN-1723534534-1:F10',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '77',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/77',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10076',
          external_study_id: '82465add-f7a1-4a2b-ae29-de68fc3a76f9',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-77',
          source_identifier: 'GEN-1723534534-1:E10',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '76',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/76',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10075',
          external_study_id: 'ef2e7bb8-ff87-414f-9637-08310f9127d4',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-76',
          source_identifier: 'GEN-1723534534-1:D10',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '75',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/75',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10074',
          external_study_id: '9af67756-332d-4c32-9088-2e92a615f3fc',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-75',
          source_identifier: 'GEN-1723534534-1:C10',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '74',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/74',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10073',
          external_study_id: 'e18f02ef-5f54-4759-985d-1e7fecb3a3ca',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-74',
          source_identifier: 'GEN-1723534534-1:B10',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '73',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/73',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10072',
          external_study_id: '6ceb7199-e998-4989-8876-168d3e48d048',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-73',
          source_identifier: 'GEN-1723534534-1:A10',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '72',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/72',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10071',
          external_study_id: 'b4529bfa-766c-4946-9de5-22be5254c848',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-72',
          source_identifier: 'GEN-1723534534-1:H9',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '71',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/71',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10070',
          external_study_id: 'ec615162-2a0b-435e-9ca4-b52da3369fdf',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-71',
          source_identifier: 'GEN-1723534534-1:G9',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '70',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/70',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10069',
          external_study_id: 'daefd2f1-a919-41ad-b223-f53b01cfc179',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-70',
          source_identifier: 'GEN-1723534534-1:F9',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '69',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/69',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10068',
          external_study_id: '5269ce67-ad8b-4e10-adf0-ec5810bea32d',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-69',
          source_identifier: 'GEN-1723534534-1:E9',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '68',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/68',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10067',
          external_study_id: 'c8f69835-de7a-4bb3-8485-a0f91f0f1e5e',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-68',
          source_identifier: 'GEN-1723534534-1:D9',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '67',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/67',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10066',
          external_study_id: '3d5bb976-0e0a-4ff8-a01b-1e03ee9d47c6',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-67',
          source_identifier: 'GEN-1723534534-1:C9',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '66',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/66',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10065',
          external_study_id: '9b7ca384-6c22-4bdb-aecf-804453ce86dc',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-66',
          source_identifier: 'GEN-1723534534-1:B9',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '65',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/65',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10064',
          external_study_id: 'c54e90e8-42d2-4efe-8306-27f5399c282c',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-65',
          source_identifier: 'GEN-1723534534-1:A9',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '64',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/64',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10063',
          external_study_id: 'da22634c-4cf6-40f4-acfc-8b1f535e3d39',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-64',
          source_identifier: 'GEN-1723534534-1:H8',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '63',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/63',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10062',
          external_study_id: '936d20c6-2e8c-43f1-8e00-080de9a12aff',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-63',
          source_identifier: 'GEN-1723534534-1:G8',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '62',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/62',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10061',
          external_study_id: '347c61a4-2909-4803-82fc-7e8ef4f2798b',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-62',
          source_identifier: 'GEN-1723534534-1:F8',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '61',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/61',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10060',
          external_study_id: 'bf59d31e-703d-432f-9220-86cbfb676e4f',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-61',
          source_identifier: 'GEN-1723534534-1:E8',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '60',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/60',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10059',
          external_study_id: '145b6d76-3a5b-4949-9806-c114a0d0bb98',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-60',
          source_identifier: 'GEN-1723534534-1:D8',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '59',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/59',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10058',
          external_study_id: '03729437-5106-49b9-ace8-dc1f7ef7f07e',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-59',
          source_identifier: 'GEN-1723534534-1:C8',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '58',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/58',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10057',
          external_study_id: '3907feef-33fa-4386-a364-fa65e003920b',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-58',
          source_identifier: 'GEN-1723534534-1:B8',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '57',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/57',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10056',
          external_study_id: '11b428e8-90b4-4d9b-9bc9-b4019ba6849f',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-57',
          source_identifier: 'GEN-1723534534-1:A8',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '56',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/56',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10055',
          external_study_id: 'b9e3443b-bb79-4f80-8b4d-0abd6f944b2b',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-56',
          source_identifier: 'GEN-1723534534-1:H7',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '55',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/55',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10054',
          external_study_id: '69a554e9-e631-4575-aaa1-790f82708772',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-55',
          source_identifier: 'GEN-1723534534-1:G7',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '54',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/54',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10053',
          external_study_id: '24cf4622-627e-45ec-9ff4-64e549f00a3b',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-54',
          source_identifier: 'GEN-1723534534-1:F7',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '53',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/53',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10052',
          external_study_id: '6feda3a6-bfe1-42b7-a267-27954a9a4baf',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-53',
          source_identifier: 'GEN-1723534534-1:E7',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '52',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/52',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10051',
          external_study_id: '586a0282-427a-4089-8c70-36abc94e8469',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-52',
          source_identifier: 'GEN-1723534534-1:D7',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '51',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/51',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10050',
          external_study_id: 'a459fe03-c5ca-4e1a-a27e-5d0d2c6f36b2',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-51',
          source_identifier: 'GEN-1723534534-1:C7',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '50',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/50',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10049',
          external_study_id: 'e3e5d782-e106-4573-8448-f7863c733cc7',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-50',
          source_identifier: 'GEN-1723534534-1:B7',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '49',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/49',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10048',
          external_study_id: 'd3caafd6-349e-4ed5-a335-2dc4d25e6eca',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-49',
          source_identifier: 'GEN-1723534534-1:A7',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '48',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/48',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10047',
          external_study_id: 'bc1a6284-c88c-4ae5-a640-abc701b40d35',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-48',
          source_identifier: 'GEN-1723534534-1:H6',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '47',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/47',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10046',
          external_study_id: '1466ad9d-92e7-43c3-a37b-aef86a54bbb3',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-47',
          source_identifier: 'GEN-1723534534-1:G6',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '46',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/46',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10045',
          external_study_id: 'c285ad84-d8ea-4b9c-a50f-d19d38ffc416',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-46',
          source_identifier: 'GEN-1723534534-1:F6',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '45',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/45',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10044',
          external_study_id: '5c1bf1df-b5c0-4959-9a63-1e9c4ca46bbe',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-45',
          source_identifier: 'GEN-1723534534-1:E6',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '44',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/44',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10043',
          external_study_id: '34f767c6-93a1-4a86-9fef-5970640a8a60',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-44',
          source_identifier: 'GEN-1723534534-1:D6',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '43',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/43',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10042',
          external_study_id: '660efa6c-4cd4-4d85-9d83-4a0ac96e2281',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-43',
          source_identifier: 'GEN-1723534534-1:C6',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '42',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/42',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10041',
          external_study_id: 'fb0f7402-e42e-4953-9a1b-efe1175a0c83',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-42',
          source_identifier: 'GEN-1723534534-1:B6',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '41',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/41',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10040',
          external_study_id: '18f6a894-38d0-4b67-b1b3-bc45af2555a8',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-41',
          source_identifier: 'GEN-1723534534-1:A6',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '40',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/40',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10039',
          external_study_id: '146a2bc4-91e0-4e28-95e5-6e7ed1102c42',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-40',
          source_identifier: 'GEN-1723534534-1:H5',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '39',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/39',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10038',
          external_study_id: '5265d5e2-cf0c-4d89-bee3-acfc2f896d30',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-39',
          source_identifier: 'GEN-1723534534-1:G5',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '38',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/38',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10037',
          external_study_id: '239ffe02-8622-495a-b807-a7a1c9be939f',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-38',
          source_identifier: 'GEN-1723534534-1:F5',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '37',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/37',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10036',
          external_study_id: '3faef040-6d3b-45ff-a002-25ac6eee08b6',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-37',
          source_identifier: 'GEN-1723534534-1:E5',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '36',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/36',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10035',
          external_study_id: '1371398e-f6cf-4fc2-b011-6f7b323828f5',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-36',
          source_identifier: 'GEN-1723534534-1:D5',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '35',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/35',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10034',
          external_study_id: 'baaf882d-7f4f-4d55-9735-94c6d4e3bab9',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-35',
          source_identifier: 'GEN-1723534534-1:C5',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '34',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/34',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10033',
          external_study_id: '5ce2449f-6b26-485e-8442-2cc6bd0b4245',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-34',
          source_identifier: 'GEN-1723534534-1:B5',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '33',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/33',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10032',
          external_study_id: '0284ec15-1c0a-4c7e-8c5d-732fd482afbf',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-33',
          source_identifier: 'GEN-1723534534-1:A5',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '32',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/32',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10031',
          external_study_id: 'b0102167-4da6-4648-b0a8-431991c5ad9c',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-32',
          source_identifier: 'GEN-1723534534-1:H4',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '31',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/31',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10030',
          external_study_id: 'e73ce24f-bf9a-4c6d-9965-fc9d156d3fcf',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-31',
          source_identifier: 'GEN-1723534534-1:G4',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '30',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/30',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10029',
          external_study_id: 'd47d2f14-fd20-444a-b9d8-47f103273bff',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-30',
          source_identifier: 'GEN-1723534534-1:F4',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '29',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/29',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10028',
          external_study_id: '00ecb08c-e112-497c-9ec4-42cb7a8f38b3',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-29',
          source_identifier: 'GEN-1723534534-1:E4',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '28',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/28',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10027',
          external_study_id: '050e2ed2-0159-47d6-8d32-33c0556c04da',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-28',
          source_identifier: 'GEN-1723534534-1:D4',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '27',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/27',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10026',
          external_study_id: '38d0b37b-b1c3-4735-9361-939ecbc453be',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-27',
          source_identifier: 'GEN-1723534534-1:C4',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '26',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/26',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10025',
          external_study_id: '9599e796-8f76-4664-a12c-c03930c7b78f',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-26',
          source_identifier: 'GEN-1723534534-1:B4',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '25',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/25',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10024',
          external_study_id: 'ac911115-23f6-487a-9f6a-4d874d900b78',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-25',
          source_identifier: 'GEN-1723534534-1:A4',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '24',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/24',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10023',
          external_study_id: '810e8c9d-11d2-4a7e-9061-b90d08a21ef2',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-24',
          source_identifier: 'GEN-1723534534-1:H3',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '23',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/23',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10022',
          external_study_id: '4d3fc005-71b9-4456-b1b7-8822eb3a4cbc',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-23',
          source_identifier: 'GEN-1723534534-1:G3',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '22',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/22',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10021',
          external_study_id: 'b14d73aa-3fea-4c45-83c6-ec8540fbe7c6',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-22',
          source_identifier: 'GEN-1723534534-1:F3',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '21',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/21',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10020',
          external_study_id: '4bf86783-d598-48d7-99c7-9cf0e00f4ed7',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-21',
          source_identifier: 'GEN-1723534534-1:E3',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '20',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/20',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10019',
          external_study_id: '476bfefb-0dd0-4fea-8b6a-34014e746f6d',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-20',
          source_identifier: 'GEN-1723534534-1:D3',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '19',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/19',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10018',
          external_study_id: '8a1d6504-401d-4f49-9c42-1b6e92a0a4e5',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-19',
          source_identifier: 'GEN-1723534534-1:C3',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '18',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/18',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10017',
          external_study_id: 'b4d14f57-68c5-4e9d-b07d-0bb2f2acda83',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-18',
          source_identifier: 'GEN-1723534534-1:B3',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '17',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/17',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10016',
          external_study_id: '211b322e-1f43-40cd-9fcf-91051a7a13ec',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-17',
          source_identifier: 'GEN-1723534534-1:A3',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '16',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/16',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10015',
          external_study_id: 'a233c9af-215b-4a1b-a2ab-88274cc9a69d',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-16',
          source_identifier: 'GEN-1723534534-1:H2',
          created_at: '2024/08/13 07:35',
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
          external_study_id: '1b17020f-0d50-456a-a294-4de44b2c08b2',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-15',
          source_identifier: 'GEN-1723534534-1:G2',
          created_at: '2024/08/13 07:35',
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
          external_study_id: 'e6792690-f8a1-4399-adb9-96177bcd84ee',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-14',
          source_identifier: 'GEN-1723534534-1:F2',
          created_at: '2024/08/13 07:35',
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
          external_study_id: '32763834-7734-4096-b28f-1c6ba7301b73',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-13',
          source_identifier: 'GEN-1723534534-1:E2',
          created_at: '2024/08/13 07:35',
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
          external_study_id: '84073d4c-1c4c-4e61-aa55-d5a8a6a929bf',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-12',
          source_identifier: 'GEN-1723534534-1:D2',
          created_at: '2024/08/13 07:35',
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
          external_study_id: 'f8e4429d-293e-459f-a930-7dd85782de39',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-11',
          source_identifier: 'GEN-1723534534-1:C2',
          created_at: '2024/08/13 07:35',
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
          external_study_id: 'c21a1b25-f04d-4c92-aecb-5adb36385f2f',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-10',
          source_identifier: 'GEN-1723534534-1:B2',
          created_at: '2024/08/13 07:35',
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
          external_study_id: '704ad747-7cae-4a7b-9831-f557a4f715cf',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-9',
          source_identifier: 'GEN-1723534534-1:A2',
          created_at: '2024/08/13 07:35',
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
          external_study_id: '5c40230a-2496-4561-885a-f783095408ad',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-8',
          source_identifier: 'GEN-1723534534-1:H1',
          created_at: '2024/08/13 07:35',
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
          external_study_id: '731619c8-ee41-4181-8b1f-3620ca433611',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-7',
          source_identifier: 'GEN-1723534534-1:G1',
          created_at: '2024/08/13 07:35',
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
          external_study_id: '69c6231a-61e7-4efe-85d2-6fa8d3bb5d36',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-6',
          source_identifier: 'GEN-1723534534-1:F1',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '5',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/5',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10004',
          external_study_id: '3284f437-0b28-4e80-bb19-42d0bade7c3f',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-5',
          source_identifier: 'GEN-1723534534-1:E1',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '4',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/4',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10003',
          external_study_id: '2270b424-5a62-44c9-87c2-8d9ae05e1c0f',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-4',
          source_identifier: 'GEN-1723534534-1:D1',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '3',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/3',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10002',
          external_study_id: 'a118902e-870b-4d4d-8b28-0a91da69603e',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-3',
          source_identifier: 'GEN-1723534534-1:C1',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '2',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/2',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10001',
          external_study_id: 'e9dc65a2-98f2-474e-991f-45425d920957',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-2',
          source_identifier: 'GEN-1723534534-1:B1',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '1',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/1',
        },
        attributes: {
          library_type: 'ONT_GridIon',
          data_type: 'basecalls',
          cost_code: 'S10000',
          external_study_id: '48b91e9e-aeea-4fcb-986a-8227faab06e8',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1723534534-1',
          source_identifier: 'GEN-1723534534-1:A1',
          created_at: '2024/08/13 07:35',
        },
      },
      {
        id: '28',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/28',
        },
        attributes: {
          barcode: 'TRAC-2-28',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/28/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/28/pools',
            },
            data: [
              {
                type: 'pools',
                id: '1',
              },
            ],
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/28/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/28/requests',
            },
          },
        },
      },
      {
        id: '29',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/29',
        },
        attributes: {
          barcode: 'TRAC-2-29',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/29/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/29/pools',
            },
            data: [
              {
                type: 'pools',
                id: '2',
              },
            ],
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/29/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/29/requests',
            },
          },
        },
      },
      {
        id: '30',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/30',
        },
        attributes: {
          barcode: 'TRAC-2-30',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/30/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/30/pools',
            },
            data: [
              {
                type: 'pools',
                id: '3',
              },
            ],
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/30/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/30/requests',
            },
          },
        },
      },
      {
        id: '31',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/31',
        },
        attributes: {
          barcode: 'TRAC-2-31',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/31/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/31/pools',
            },
            data: [
              {
                type: 'pools',
                id: '4',
              },
            ],
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/31/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/31/requests',
            },
          },
        },
      },
      {
        id: '32',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/32',
        },
        attributes: {
          barcode: 'TRAC-2-32',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/32/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/32/pools',
            },
            data: [
              {
                type: 'pools',
                id: '5',
              },
            ],
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/32/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/32/requests',
            },
          },
        },
      },
      {
        id: '33',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/33',
        },
        attributes: {
          barcode: 'TRAC-2-33',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/33/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/33/pools',
            },
            data: [
              {
                type: 'pools',
                id: '6',
              },
            ],
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/33/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/33/requests',
            },
          },
        },
      },
      {
        id: '34',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/34',
        },
        attributes: {
          barcode: 'TRAC-2-34',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/34/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/34/pools',
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
              self: 'http://localhost:3100/v1/ont/tubes/34/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/34/requests',
            },
          },
        },
      },
      {
        id: '35',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/35',
        },
        attributes: {
          barcode: 'TRAC-2-35',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/35/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/35/pools',
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
              self: 'http://localhost:3100/v1/ont/tubes/35/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/35/requests',
            },
          },
        },
      },
      {
        id: '36',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/36',
        },
        attributes: {
          barcode: 'TRAC-2-36',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/36/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/36/pools',
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
              self: 'http://localhost:3100/v1/ont/tubes/36/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/36/requests',
            },
          },
        },
      },
      {
        id: '37',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/37',
        },
        attributes: {
          barcode: 'TRAC-2-37',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/37/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/37/pools',
            },
            data: [
              {
                type: 'pools',
                id: '10',
              },
            ],
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/37/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/37/requests',
            },
          },
        },
      },
      {
        id: '38',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/38',
        },
        attributes: {
          barcode: 'TRAC-2-38',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/38/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/38/pools',
            },
            data: [
              {
                type: 'pools',
                id: '11',
              },
            ],
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/38/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/38/requests',
            },
          },
        },
      },
      {
        id: '39',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/39',
        },
        attributes: {
          barcode: 'TRAC-2-39',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/39/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/39/pools',
            },
            data: [
              {
                type: 'pools',
                id: '12',
              },
            ],
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/39/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/39/requests',
            },
          },
        },
      },
      {
        id: '40',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/40',
        },
        attributes: {
          barcode: 'TRAC-2-40',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/40/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/40/pools',
            },
            data: [
              {
                type: 'pools',
                id: '13',
              },
            ],
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/40/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/40/requests',
            },
          },
        },
      },
      {
        id: '41',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/41',
        },
        attributes: {
          barcode: 'TRAC-2-41',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/41/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/41/pools',
            },
            data: [
              {
                type: 'pools',
                id: '14',
              },
            ],
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/41/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/41/requests',
            },
          },
        },
      },
      {
        id: '42',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/ont/tubes/42',
        },
        attributes: {
          barcode: 'TRAC-2-42',
        },
        relationships: {
          pools: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/42/relationships/pools',
              related: 'http://localhost:3100/v1/ont/tubes/42/pools',
            },
            data: [
              {
                type: 'pools',
                id: '15',
              },
            ],
          },
          requests: {
            links: {
              self: 'http://localhost:3100/v1/ont/tubes/42/relationships/requests',
              related: 'http://localhost:3100/v1/ont/tubes/42/requests',
            },
          },
        },
      },
    ],
    meta: {
      page_count: 1,
    },
    links: {
      first:
        'http://localhost:3100/v1/ont/pools?include=libraries.tag.tag_set%2Clibraries.source_plate.wells.requests%2Clibraries.source_tube.requests%2Clibraries.request%2Ctube&page%5Bnumber%5D=1&page%5Bsize%5D=1000',
      last: 'http://localhost:3100/v1/ont/pools?include=libraries.tag.tag_set%2Clibraries.source_plate.wells.requests%2Clibraries.source_tube.requests%2Clibraries.request%2Ctube&page%5Bnumber%5D=1&page%5Bsize%5D=1000',
    },
  }

  return { ...BaseFactory(data), includedData: createIncludedData(data.included) }
}

export default OntPoolFactory
