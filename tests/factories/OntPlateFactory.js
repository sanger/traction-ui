import BaseFactory from './BaseFactory.js'
import { groupIncludedByResource, find } from './../../src/api/JsonApi.js'

const createStoreData = (data) => {
  const plates = data.data
  const { requests, wells } = groupIncludedByResource(data.included)
  return { plates, requests, wells }
}

const OntPlateFactory = ({ count = undefined } = {}) => {
  const data = {
    data: [
      {
        id: '1',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/ont/plates/1',
        },
        attributes: {
          barcode: 'GEN-1668092750-1',
          created_at: '2022/11/10 15:05',
        },
        relationships: {
          wells: {
            links: {
              self: 'http://localhost:3100/v1/ont/plates/1/relationships/wells',
              related: 'http://localhost:3100/v1/ont/plates/1/wells',
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
              {
                type: 'wells',
                id: '3',
              },
              {
                type: 'wells',
                id: '4',
              },
              {
                type: 'wells',
                id: '5',
              },
              {
                type: 'wells',
                id: '6',
              },
              {
                type: 'wells',
                id: '7',
              },
              {
                type: 'wells',
                id: '8',
              },
            ],
          },
        },
      },
      {
        id: '2',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/ont/plates/2',
        },
        attributes: {
          barcode: 'GEN-1668092750-2',
          created_at: '2022/11/10 15:05',
        },
        relationships: {
          wells: {
            links: {
              self: 'http://localhost:3100/v1/ont/plates/2/relationships/wells',
              related: 'http://localhost:3100/v1/ont/plates/2/wells',
            },
            data: [
              {
                type: 'wells',
                id: '96',
              },
              {
                type: 'wells',
                id: '97',
              },
              {
                type: 'wells',
                id: '98',
              },
              {
                type: 'wells',
                id: '99',
              },
              {
                type: 'wells',
                id: '100',
              },
              {
                type: 'wells',
                id: '101',
              },
              {
                type: 'wells',
                id: '102',
              },
              {
                type: 'wells',
                id: '103',
              },
            ],
          },
        },
      },
    ],
    included: [
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
                id: '1',
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
                id: '2',
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
        id: '3',
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
              id: '1',
            },
          },
        },
      },
      {
        id: '4',
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
              id: '1',
            },
          },
        },
      },
      {
        id: '5',
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
              id: '1',
            },
          },
        },
      },
      {
        id: '6',
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
              id: '1',
            },
          },
        },
      },
      {
        id: '7',
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
              id: '1',
            },
          },
        },
      },
      {
        id: '8',
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
              id: '1',
            },
          },
        },
      },
      {
        id: '96',
        type: 'wells',
        attributes: {
          position: 'A1',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '96',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '2',
            },
          },
        },
      },
      {
        id: '97',
        type: 'wells',
        attributes: {
          position: 'B1',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '97',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '2',
            },
          },
        },
      },
      {
        id: '98',
        type: 'wells',
        attributes: {
          position: 'C1',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '98',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '2',
            },
          },
        },
      },
      {
        id: '99',
        type: 'wells',
        attributes: {
          position: 'D1',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '99',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '2',
            },
          },
        },
      },
      {
        id: '100',
        type: 'wells',
        attributes: {
          position: 'E1',
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
              id: '2',
            },
          },
        },
      },
      {
        id: '101',
        type: 'wells',
        attributes: {
          position: 'F1',
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
              id: '2',
            },
          },
        },
      },
      {
        id: '102',
        type: 'wells',
        attributes: {
          position: 'G1',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '102',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '2',
            },
          },
        },
      },
      {
        id: '103',
        type: 'wells',
        attributes: {
          position: 'H1',
        },
        relationships: {
          requests: {
            data: [
              {
                type: 'requests',
                id: '103',
              },
            ],
          },
          plate: {
            data: {
              type: 'plates',
              id: '2',
            },
          },
        },
      },
      {
        id: '103',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/103',
        },
        attributes: {
          library_type: 'ONT_GridIon_mplx',
          data_type: 'basecalls and raw data',
          cost_code: 'S10102',
          external_study_id: '6b53ffbf-255c-4cc0-b6fc-53bf47bf4ce6',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-103',
          source_identifier: 'GEN-1668092750-2:H1',
          created_at: '2022/11/10 15:05',
        },
      },
      {
        id: '102',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/102',
        },
        attributes: {
          library_type: 'ONT_GridIon_mplx',
          data_type: 'basecalls and raw data',
          cost_code: 'S10101',
          external_study_id: '318bd93b-a1d8-4b96-b950-6f71c7410be5',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-102',
          source_identifier: 'GEN-1668092750-2:G1',
          created_at: '2022/11/10 15:05',
        },
      },
      {
        id: '101',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/101',
        },
        attributes: {
          library_type: 'ONT_GridIon_mplx',
          data_type: 'basecalls and raw data',
          cost_code: 'S10100',
          external_study_id: '0f589d5a-aefb-448f-8dd5-b70a0f9b9536',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-101',
          source_identifier: 'GEN-1668092750-2:F1',
          created_at: '2022/11/10 15:05',
        },
      },
      {
        id: '100',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/100',
        },
        attributes: {
          library_type: 'ONT_GridIon_mplx',
          data_type: 'basecalls and raw data',
          cost_code: 'S10099',
          external_study_id: 'f687d290-b673-46aa-ad0a-a1d2d7fdb478',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-100',
          source_identifier: 'GEN-1668092750-2:E1',
          created_at: '2022/11/10 15:05',
        },
      },
      {
        id: '99',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/99',
        },
        attributes: {
          library_type: 'ONT_GridIon_mplx',
          data_type: 'basecalls and raw data',
          cost_code: 'S10098',
          external_study_id: '16852a67-dce5-4e4c-8f42-50b57311310f',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-99',
          source_identifier: 'GEN-1668092750-2:D1',
          created_at: '2022/11/10 15:05',
        },
      },
      {
        id: '98',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/98',
        },
        attributes: {
          library_type: 'ONT_GridIon_mplx',
          data_type: 'basecalls and raw data',
          cost_code: 'S10097',
          external_study_id: '17f5b6dc-700b-4233-9ac9-fb6caaf80822',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-98',
          source_identifier: 'GEN-1668092750-2:C1',
          created_at: '2022/11/10 15:05',
        },
      },
      {
        id: '97',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/97',
        },
        attributes: {
          library_type: 'ONT_GridIon_mplx',
          data_type: 'basecalls and raw data',
          cost_code: 'S10096',
          external_study_id: 'a63f873f-5e22-4242-8aef-d1165b63ccab',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-97',
          source_identifier: 'GEN-1668092750-2:B1',
          created_at: '2022/11/10 15:05',
        },
      },
      {
        id: '96',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/ont/requests/96',
        },
        attributes: {
          library_type: 'ONT_GridIon_mplx',
          data_type: 'basecalls and raw data',
          cost_code: 'S10095',
          external_study_id: '96aa2032-137e-4beb-a898-f015a35e1b60',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-96',
          source_identifier: 'GEN-1668092750-2:A1',
          created_at: '2022/11/10 15:05',
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
          external_study_id: 'e1631356-c853-48a2-b370-cda99e77c897',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-8',
          source_identifier: 'GEN-1668092750-1:H1',
          created_at: '2022/11/10 15:05',
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
          external_study_id: 'c6064d7b-9f1f-4a87-8822-51f211b33b71',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-7',
          source_identifier: 'GEN-1668092750-1:G1',
          created_at: '2022/11/10 15:05',
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
          external_study_id: '40362d49-0a20-4223-9189-36db1de70462',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-6',
          source_identifier: 'GEN-1668092750-1:F1',
          created_at: '2022/11/10 15:05',
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
          external_study_id: '536c3ac9-d610-4a51-92e8-ce43253df93c',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-5',
          source_identifier: 'GEN-1668092750-1:E1',
          created_at: '2022/11/10 15:05',
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
          external_study_id: '2f15931d-77ad-44dc-81f2-0d3199f7b5ab',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-4',
          source_identifier: 'GEN-1668092750-1:D1',
          created_at: '2022/11/10 15:05',
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
          external_study_id: '0797971c-21ed-4a73-9492-993d09a4d8d5',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-3',
          source_identifier: 'GEN-1668092750-1:C1',
          created_at: '2022/11/10 15:05',
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
          external_study_id: '73649c3b-39d5-436a-b7a6-aa778563634c',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-2',
          source_identifier: 'GEN-1668092750-1:B1',
          created_at: '2022/11/10 15:05',
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
          external_study_id: 'e190018b-3769-47af-a327-c293fcd7223c',
          number_of_flowcells: 1,
          sample_name: 'GENSAMPLE-1668092750-1',
          source_identifier: 'GEN-1668092750-1:A1',
          created_at: '2022/11/10 15:05',
        },
      },
    ],
  }

  // if first is completed find the data otherwise return all data
  const foundData = find({ data, count, get: true })

  return { ...BaseFactory(foundData), storeData: createStoreData(foundData) }
}

export default OntPlateFactory
