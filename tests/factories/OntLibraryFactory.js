import BaseFactory from './BaseFactory.js'

const createStoreData = () => {
  // this is horrible but I would need to refactor mutations to be more flexible.
  return {
    poolingLibraries: {
      1: {
        ont_request_id: '1',
        kit_barcode: 'barcode-0',
        tag_id: null,
        volume: 8,
        concentration: 4,
        insert_size: 4068,
        id: '1',
        type: 'libraries',
        created_at: '2022/12/02 14:18',
        deactivated_at: null,
        state: 'pending',
        request: '1',
        tube: undefined,
        tag: null,
        pool: '1',
        source_well: undefined,
        source_plate: undefined,
        source_tube: undefined,
      },
      2: {
        ont_request_id: '2',
        kit_barcode: 'barcode-1',
        tag_id: null,
        volume: 7,
        concentration: 7,
        insert_size: 8247,
        id: '2',
        type: 'libraries',
        created_at: '2022/12/02 14:18',
        deactivated_at: null,
        state: 'pending',
        request: '2',
        tube: undefined,
        tag: null,
        pool: '2',
        source_well: undefined,
        source_plate: undefined,
        source_tube: undefined,
      },
      3: {
        ont_request_id: '3',
        kit_barcode: 'barcode-2',
        tag_id: null,
        volume: 3,
        concentration: 3,
        insert_size: 8683,
        id: '3',
        type: 'libraries',
        created_at: '2022/12/02 14:18',
        deactivated_at: null,
        state: 'pending',
        request: '3',
        tube: undefined,
        tag: null,
        pool: '3',
        source_well: undefined,
        source_plate: undefined,
        source_tube: undefined,
      },
      4: {
        ont_request_id: '4',
        kit_barcode: 'barcode-3',
        tag_id: null,
        volume: 4,
        concentration: 6,
        insert_size: 6997,
        id: '4',
        type: 'libraries',
        created_at: '2022/12/02 14:18',
        deactivated_at: null,
        state: 'pending',
        request: '4',
        tube: undefined,
        tag: null,
        pool: '4',
        source_well: undefined,
        source_plate: undefined,
        source_tube: undefined,
      },
    },
  }
}

const OntLibraryFactory = () => {
  const data = {
    data: [
      {
        id: '1',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/ont/libraries/1',
        },
        attributes: {
          volume: 8,
          kit_barcode: 'barcode-0',
          concentration: 4,
          insert_size: 4068,
          created_at: '2022/12/02 14:18',
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
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/1/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/1/source_tube',
            },
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
          volume: 7,
          kit_barcode: 'barcode-1',
          concentration: 7,
          insert_size: 8247,
          created_at: '2022/12/02 14:18',
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
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/2/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/2/source_tube',
            },
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
          volume: 3,
          kit_barcode: 'barcode-2',
          concentration: 3,
          insert_size: 8683,
          created_at: '2022/12/02 14:18',
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
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/3/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/3/source_tube',
            },
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
          volume: 4,
          kit_barcode: 'barcode-3',
          concentration: 6,
          insert_size: 6997,
          created_at: '2022/12/02 14:18',
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
          },
          source_tube: {
            links: {
              self: 'http://localhost:3100/v1/ont/libraries/4/relationships/source_tube',
              related: 'http://localhost:3100/v1/ont/libraries/4/source_tube',
            },
          },
        },
      },
    ],
    included: [
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
          external_study_id: '87e23bde-2224-4042-8954-a41e69e46c8f',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1669990696-4',
          source_identifier: 'GEN-1669990696-1:D1',
          created_at: '2022/12/02 14:18',
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
          external_study_id: 'a5fe5d54-4e20-410c-88e0-a06bd1f7a478',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1669990696-3',
          source_identifier: 'GEN-1669990696-1:C1',
          created_at: '2022/12/02 14:18',
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
          external_study_id: '4b4cb058-b8b0-45c5-ab89-a64208745150',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1669990696-2',
          source_identifier: 'GEN-1669990696-1:B1',
          created_at: '2022/12/02 14:18',
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
          external_study_id: '1c05c80b-f056-4a6a-b104-25e7bd5e3cba',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1669990696-1',
          source_identifier: 'GEN-1669990696-1:A1',
          created_at: '2022/12/02 14:18',
        },
      },
    ],
    links: {
      first:
        'http://localhost:3100/v1/ont/libraries?include=request%2Ctag&page%5Bnumber%5D=1&page%5Bsize%5D=4',
      next: 'http://localhost:3100/v1/ont/libraries?include=request%2Ctag&page%5Bnumber%5D=2&page%5Bsize%5D=4',
      last: 'http://localhost:3100/v1/ont/libraries?include=request%2Ctag&page%5Bnumber%5D=13&page%5Bsize%5D=4',
    },
  }

  return { ...BaseFactory(data), storeData: createStoreData() }
}

export default OntLibraryFactory
