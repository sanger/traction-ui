import BaseFactory from './BaseFactory.js'
import { extractAttributes } from '@/api/JsonApi.js'

const createStoreData = (data) => {
  return data.data.map((run) => extractAttributes(run))
}
/**
 * Factory for creating a Saphyr Pipeline Run
 * @returns a base factory object with the run data
 * store data object is for simulating the stored data in tests
 */
const SaphyrRunFactory = () => {
  const data = {
    data: [
      {
        id: '1',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/saphyr/runs/6',
        },
        attributes: {
          state: 'pending',
          chip_barcode: 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX',
          created_at: '2024/10/01 11:03',
          name: 1,
        },
        relationships: {
          chip: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/runs/6/relationships/chip',
              related: 'http://localhost:3100/v1/saphyr/runs/6/chip',
            },
            data: {
              type: 'chips',
              id: '1',
            },
          },
        },
      },
      {
        id: '2',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/saphyr/runs/7',
        },
        attributes: {
          state: 'started',
          chip_barcode: 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX',
          created_at: '2024/10/01 11:03',
          name: 2,
        },
        relationships: {
          chip: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/runs/7/relationships/chip',
              related: 'http://localhost:3100/v1/saphyr/runs/7/chip',
            },
            data: {
              type: 'chips',
              id: '2',
            },
          },
        },
      },
      {
        id: '3',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/saphyr/runs/8',
        },
        attributes: {
          state: 'completed',
          chip_barcode: 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX',
          created_at: '2024/10/01 11:03',
          name: 3,
        },
        relationships: {
          chip: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/runs/8/relationships/chip',
              related: 'http://localhost:3100/v1/saphyr/runs/8/chip',
            },
            data: {
              type: 'chips',
              id: '3',
            },
          },
        },
      },
      {
        id: '4',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/saphyr/runs/9',
        },
        attributes: {
          state: 'cancelled',
          chip_barcode: 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX',
          created_at: '2024/10/01 11:03',
          name: 4,
        },
        relationships: {
          chip: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/runs/9/relationships/chip',
              related: 'http://localhost:3100/v1/saphyr/runs/9/chip',
            },
            data: {
              type: 'chips',
              id: '4',
            },
          },
        },
      },
      {
        id: '5',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/saphyr/runs/10',
        },
        attributes: {
          state: 'pending',
          chip_barcode: 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX',
          created_at: '2024/10/01 11:03',
          name: 5,
        },
        relationships: {
          chip: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/runs/10/relationships/chip',
              related: 'http://localhost:3100/v1/saphyr/runs/10/chip',
            },
            data: {
              type: 'chips',
              id: '5',
            },
          },
        },
      },
    ],
    included: [
      {
        id: '1',
        type: 'chips',
        links: {
          self: 'http://localhost:3100/v1/saphyr/chips/6',
        },
        attributes: {
          barcode: 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX',
        },
        relationships: {
          flowcells: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/chips/6/relationships/flowcells',
              related: 'http://localhost:3100/v1/saphyr/chips/6/flowcells',
            },
            data: [
              {
                type: 'flowcells',
                id: '11',
              },
              {
                type: 'flowcells',
                id: '12',
              },
            ],
          },
        },
      },
      {
        id: '2',
        type: 'chips',
        links: {
          self: 'http://localhost:3100/v1/saphyr/chips/7',
        },
        attributes: {
          barcode: 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX',
        },
        relationships: {
          flowcells: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/chips/7/relationships/flowcells',
              related: 'http://localhost:3100/v1/saphyr/chips/7/flowcells',
            },
            data: [
              {
                type: 'flowcells',
                id: '13',
              },
              {
                type: 'flowcells',
                id: '14',
              },
            ],
          },
        },
      },
      {
        id: '3',
        type: 'chips',
        links: {
          self: 'http://localhost:3100/v1/saphyr/chips/8',
        },
        attributes: {
          barcode: 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX',
        },
        relationships: {
          flowcells: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/chips/8/relationships/flowcells',
              related: 'http://localhost:3100/v1/saphyr/chips/8/flowcells',
            },
            data: [
              {
                type: 'flowcells',
                id: '15',
              },
              {
                type: 'flowcells',
                id: '16',
              },
            ],
          },
        },
      },
      {
        id: '4',
        type: 'chips',
        links: {
          self: 'http://localhost:3100/v1/saphyr/chips/9',
        },
        attributes: {
          barcode: 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX',
        },
        relationships: {
          flowcells: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/chips/9/relationships/flowcells',
              related: 'http://localhost:3100/v1/saphyr/chips/9/flowcells',
            },
            data: [
              {
                type: 'flowcells',
                id: '17',
              },
              {
                type: 'flowcells',
                id: '18',
              },
            ],
          },
        },
      },
      {
        id: '5',
        type: 'chips',
        links: {
          self: 'http://localhost:3100/v1/saphyr/chips/10',
        },
        attributes: {
          barcode: 'FLEVEAOLPTOWPNWU20319131581014320190911XXXXXXXXXXXXX',
        },
        relationships: {
          flowcells: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/chips/10/relationships/flowcells',
              related: 'http://localhost:3100/v1/saphyr/chips/10/flowcells',
            },
            data: [
              {
                type: 'flowcells',
                id: '19',
              },
              {
                type: 'flowcells',
                id: '20',
              },
            ],
          },
        },
      },
      {
        id: '11',
        type: 'flowcells',
        links: {
          self: 'http://localhost:3100/v1/saphyr/flowcells/11',
        },
        attributes: {
          position: 1,
        },
        relationships: {
          library: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/flowcells/11/relationships/library',
              related: 'http://localhost:3100/v1/saphyr/flowcells/11/library',
            },
            data: {
              type: 'libraries',
              id: '6',
            },
          },
        },
      },
      {
        id: '12',
        type: 'flowcells',
        links: {
          self: 'http://localhost:3100/v1/saphyr/flowcells/12',
        },
        attributes: {
          position: 2,
        },
        relationships: {
          library: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/flowcells/12/relationships/library',
              related: 'http://localhost:3100/v1/saphyr/flowcells/12/library',
            },
            data: {
              type: 'libraries',
              id: '6',
            },
          },
        },
      },
      {
        id: '13',
        type: 'flowcells',
        links: {
          self: 'http://localhost:3100/v1/saphyr/flowcells/13',
        },
        attributes: {
          position: 1,
        },
        relationships: {
          library: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/flowcells/13/relationships/library',
              related: 'http://localhost:3100/v1/saphyr/flowcells/13/library',
            },
            data: {
              type: 'libraries',
              id: '7',
            },
          },
        },
      },
      {
        id: '14',
        type: 'flowcells',
        links: {
          self: 'http://localhost:3100/v1/saphyr/flowcells/14',
        },
        attributes: {
          position: 2,
        },
        relationships: {
          library: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/flowcells/14/relationships/library',
              related: 'http://localhost:3100/v1/saphyr/flowcells/14/library',
            },
            data: {
              type: 'libraries',
              id: '7',
            },
          },
        },
      },
      {
        id: '15',
        type: 'flowcells',
        links: {
          self: 'http://localhost:3100/v1/saphyr/flowcells/15',
        },
        attributes: {
          position: 1,
        },
        relationships: {
          library: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/flowcells/15/relationships/library',
              related: 'http://localhost:3100/v1/saphyr/flowcells/15/library',
            },
            data: {
              type: 'libraries',
              id: '8',
            },
          },
        },
      },
      {
        id: '16',
        type: 'flowcells',
        links: {
          self: 'http://localhost:3100/v1/saphyr/flowcells/16',
        },
        attributes: {
          position: 2,
        },
        relationships: {
          library: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/flowcells/16/relationships/library',
              related: 'http://localhost:3100/v1/saphyr/flowcells/16/library',
            },
            data: {
              type: 'libraries',
              id: '8',
            },
          },
        },
      },
      {
        id: '17',
        type: 'flowcells',
        links: {
          self: 'http://localhost:3100/v1/saphyr/flowcells/17',
        },
        attributes: {
          position: 1,
        },
        relationships: {
          library: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/flowcells/17/relationships/library',
              related: 'http://localhost:3100/v1/saphyr/flowcells/17/library',
            },
            data: {
              type: 'libraries',
              id: '9',
            },
          },
        },
      },
      {
        id: '18',
        type: 'flowcells',
        links: {
          self: 'http://localhost:3100/v1/saphyr/flowcells/18',
        },
        attributes: {
          position: 2,
        },
        relationships: {
          library: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/flowcells/18/relationships/library',
              related: 'http://localhost:3100/v1/saphyr/flowcells/18/library',
            },
            data: {
              type: 'libraries',
              id: '9',
            },
          },
        },
      },
      {
        id: '19',
        type: 'flowcells',
        links: {
          self: 'http://localhost:3100/v1/saphyr/flowcells/19',
        },
        attributes: {
          position: 1,
        },
        relationships: {
          library: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/flowcells/19/relationships/library',
              related: 'http://localhost:3100/v1/saphyr/flowcells/19/library',
            },
            data: {
              type: 'libraries',
              id: '10',
            },
          },
        },
      },
      {
        id: '20',
        type: 'flowcells',
        links: {
          self: 'http://localhost:3100/v1/saphyr/flowcells/20',
        },
        attributes: {
          position: 2,
        },
        relationships: {
          library: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/flowcells/20/relationships/library',
              related: 'http://localhost:3100/v1/saphyr/flowcells/20/library',
            },
            data: {
              type: 'libraries',
              id: '10',
            },
          },
        },
      },
      {
        id: '6',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/saphyr/libraries/6',
        },
        attributes: {
          state: 'pending',
          barcode: 'TRAC-2-47',
          sample_name: 'SaphyrSample1',
          enzyme_name: 'Nb.BbvCI',
          created_at: '2024/10/01 11:03',
          deactivated_at: null,
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/libraries/6/relationships/request',
              related: 'http://localhost:3100/v1/saphyr/libraries/6/request',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/libraries/6/relationships/tube',
              related: 'http://localhost:3100/v1/saphyr/libraries/6/tube',
            },
          },
        },
      },
      {
        id: '7',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/saphyr/libraries/7',
        },
        attributes: {
          state: 'pending',
          barcode: 'TRAC-2-48',
          sample_name: 'SaphyrSample2',
          enzyme_name: 'Nb.BbvCI',
          created_at: '2024/10/01 11:03',
          deactivated_at: null,
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/libraries/7/relationships/request',
              related: 'http://localhost:3100/v1/saphyr/libraries/7/request',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/libraries/7/relationships/tube',
              related: 'http://localhost:3100/v1/saphyr/libraries/7/tube',
            },
          },
        },
      },
      {
        id: '8',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/saphyr/libraries/8',
        },
        attributes: {
          state: 'pending',
          barcode: 'TRAC-2-49',
          sample_name: 'SaphyrSample3',
          enzyme_name: 'Nb.BbvCI',
          created_at: '2024/10/01 11:03',
          deactivated_at: null,
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/libraries/8/relationships/request',
              related: 'http://localhost:3100/v1/saphyr/libraries/8/request',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/libraries/8/relationships/tube',
              related: 'http://localhost:3100/v1/saphyr/libraries/8/tube',
            },
          },
        },
      },
      {
        id: '9',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/saphyr/libraries/9',
        },
        attributes: {
          state: 'pending',
          barcode: 'TRAC-2-50',
          sample_name: 'SaphyrSample4',
          enzyme_name: 'Nb.BbvCI',
          created_at: '2024/10/01 11:03',
          deactivated_at: null,
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/libraries/9/relationships/request',
              related: 'http://localhost:3100/v1/saphyr/libraries/9/request',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/libraries/9/relationships/tube',
              related: 'http://localhost:3100/v1/saphyr/libraries/9/tube',
            },
          },
        },
      },
      {
        id: '10',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/saphyr/libraries/10',
        },
        attributes: {
          state: 'pending',
          barcode: 'TRAC-2-51',
          sample_name: 'SaphyrSample5',
          enzyme_name: 'Nb.BbvCI',
          created_at: '2024/10/01 11:03',
          deactivated_at: null,
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/libraries/10/relationships/request',
              related: 'http://localhost:3100/v1/saphyr/libraries/10/request',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/saphyr/libraries/10/relationships/tube',
              related: 'http://localhost:3100/v1/saphyr/libraries/10/tube',
            },
          },
        },
      },
    ],
    links: {
      first:
        'http://localhost:3100/v1/ont/runs?include=instrument&page%5Bnumber%5D=1&page%5Bsize%5D=25',
      last: 'http://localhost:3100/v1/ont/runs?include=instrument&page%5Bnumber%5D=1&page%5Bsize%5D=25',
    },
    meta: {
      page_count: 1,
    },
  }

  return {
    ...BaseFactory(data),
    storeData: createStoreData({ ...data }),
  }
}

export default SaphyrRunFactory
