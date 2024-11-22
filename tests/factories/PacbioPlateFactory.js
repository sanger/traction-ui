import BaseFactory from './BaseFactory.js'
import { groupIncludedByResource, find, dataToObjectById } from './../../src/api/JsonApi'

/**
 *
 * @param {Object} data - the data object
 * @returns {Object} - the data object - the plates, wells and requests
 */
const createStoreData = (data) => {
  const { wells, requests } = groupIncludedByResource(data.included)
  const storePlates = dataToObjectById({ data: data.data, includeRelationships: true })

  return {
    resources: {
      plates: storePlates,
      wells: dataToObjectById({ data: wells, includeRelationships: true }),
      requests: dataToObjectById({ data: requests, includeRelationships: true }),
    },
    selected: {
      plate: Object.values(storePlates)[0], // first plate
    },
  }
}

/*
 * Factory for creating a list of runs
 * @returns a base factory object with the runs data
 */
const PacbioPlateFactory = ({ count = undefined } = {}) => {
  const data = {
    data: [
      {
        id: '1',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/plates/1',
        },
        attributes: {
          barcode: 'GEN-1680611780-1',
          created_at: '2023/04/04 12:36',
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
        id: '61',
        type: 'plates',
        links: {
          self: '/v1/pacbio/plates/61',
        },
        attributes: {
          barcode: 'DN814327C',
          created_at: '2021/06/03 06:59',
        },
        relationships: {
          wells: {
            links: {
              self: '/v1/pacbio/plates/61/relationships/wells',
              related: '/v1/pacbio/plates/61/wells',
            },
            data: [
              {
                type: 'wells',
                id: '4722',
              },
              {
                type: 'wells',
                id: '4723',
              },
            ],
          },
        },
      },
      {
        id: '62',
        type: 'plates',
        links: {
          self: '/v1/pacbio/plates/62',
        },
        attributes: {
          barcode: 'DN814567Q',
          created_at: '2021/06/03 14:57',
        },
        relationships: {
          wells: {
            links: {
              self: '/v1/pacbio/plates/62/relationships/wells',
              related: '/v1/pacbio/plates/62/wells',
            },
            data: [
              {
                type: 'wells',
                id: '4818',
              },
              {
                type: 'wells',
                id: '4819',
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
        id: '1',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/1',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: 100,
          number_of_smrt_cells: 3,
          cost_code: 'S10000',
          external_study_id: '8fc51e6a-3cf6-4bb9-87a9-4f6510958a78',
          sample_name: 'GENSAMPLE-1680611780-1',
          barcode: null,
          sample_species: 'human',
          created_at: '2023/04/04 12:36',
          source_identifier: 'GEN-1680611780-1:A1',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/1/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/1/well',
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
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/1/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/1/tube',
            },
          },
        },
      },
      {
        id: '2',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/2',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: 100,
          number_of_smrt_cells: 3,
          cost_code: 'S10001',
          external_study_id: 'e23f5f00-250b-432d-ad7d-686d83004355',
          sample_name: 'GENSAMPLE-1680611780-2',
          barcode: null,
          sample_species: 'human',
          created_at: '2023/04/04 12:36',
          source_identifier: 'GEN-1680611780-1:B1',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/2/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/2/well',
            },
            data: {
              type: 'wells',
              id: '2',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/2/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/2/plate',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/2/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/2/tube',
            },
          },
        },
      },
      {
        id: '3',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/3',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: 100,
          number_of_smrt_cells: 3,
          cost_code: 'S10002',
          external_study_id: '718c53f2-3d75-459d-adc4-55f971948971',
          sample_name: 'GENSAMPLE-1680611780-3',
          barcode: null,
          sample_species: 'human',
          created_at: '2023/04/04 12:36',
          source_identifier: 'GEN-1680611780-1:C1',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/3/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/3/well',
            },
            data: {
              type: 'wells',
              id: '3',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/3/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/3/plate',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/3/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/3/tube',
            },
          },
        },
      },
      {
        id: '4',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/4',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: 100,
          number_of_smrt_cells: 3,
          cost_code: 'S10003',
          external_study_id: '67dddb1d-6a88-4da3-aec0-20a78846be73',
          sample_name: 'GENSAMPLE-1680611780-4',
          barcode: null,
          sample_species: 'human',
          created_at: '2023/04/04 12:36',
          source_identifier: 'GEN-1680611780-1:D1',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/4/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/4/well',
            },
            data: {
              type: 'wells',
              id: '4',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/4/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/4/plate',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/4/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/4/tube',
            },
          },
        },
      },
      {
        id: '5',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/5',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: 100,
          number_of_smrt_cells: 3,
          cost_code: 'S10004',
          external_study_id: '117d1149-9483-4183-89ae-8b7345fb048d',
          sample_name: 'GENSAMPLE-1680611780-5',
          barcode: null,
          sample_species: 'human',
          created_at: '2023/04/04 12:36',
          source_identifier: 'GEN-1680611780-1:E1',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/5/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/5/well',
            },
            data: {
              type: 'wells',
              id: '5',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/5/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/5/plate',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/5/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/5/tube',
            },
          },
        },
      },
      {
        id: '6',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/6',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: 100,
          number_of_smrt_cells: 3,
          cost_code: 'S10005',
          external_study_id: '3dee2c0d-73b7-443d-be60-17941e6ff0db',
          sample_name: 'GENSAMPLE-1680611780-6',
          barcode: null,
          sample_species: 'human',
          created_at: '2023/04/04 12:36',
          source_identifier: 'GEN-1680611780-1:F1',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/6/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/6/well',
            },
            data: {
              type: 'wells',
              id: '6',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/6/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/6/plate',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/6/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/6/tube',
            },
          },
        },
      },
      {
        id: '7',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/7',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: 100,
          number_of_smrt_cells: 3,
          cost_code: 'S10006',
          external_study_id: 'af2f3b53-e28c-4247-9ecc-3eaec3e5b584',
          sample_name: 'GENSAMPLE-1680611780-7',
          barcode: null,
          sample_species: 'human',
          created_at: '2023/04/04 12:36',
          source_identifier: 'GEN-1680611780-1:G1',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/7/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/7/well',
            },
            data: {
              type: 'wells',
              id: '7',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/7/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/7/plate',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/7/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/7/tube',
            },
          },
        },
      },
      {
        id: '8',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/8',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: 100,
          number_of_smrt_cells: 3,
          cost_code: 'S10007',
          external_study_id: '36357c31-8729-49a1-b909-09673fe86ee7',
          sample_name: 'GENSAMPLE-1680611780-8',
          barcode: null,
          sample_species: 'human',
          created_at: '2023/04/04 12:36',
          source_identifier: 'GEN-1680611780-1:H1',
        },
        relationships: {
          well: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/8/relationships/well',
              related: 'http://localhost:3100/v1/pacbio/requests/8/well',
            },
            data: {
              type: 'wells',
              id: '8',
            },
          },
          plate: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/8/relationships/plate',
              related: 'http://localhost:3100/v1/pacbio/requests/8/plate',
            },
          },
          tube: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/requests/8/relationships/tube',
              related: 'http://localhost:3100/v1/pacbio/requests/8/tube',
            },
          },
        },
      },
      {
        id: '4722',
        type: 'wells',
        attributes: {
          position: 'A1',
        },
        relationships: {
          plate: {
            data: {
              type: 'plates',
              id: '61',
            },
          },
          requests: {
            data: [
              {
                type: 'requests',
                id: '40',
              },
            ],
          },
        },
      },
      {
        id: '4723',
        type: 'wells',
        attributes: {
          position: 'A2',
        },
        relationships: {
          plate: {
            data: {
              type: 'plates',
              id: '61',
            },
          },
          requests: {
            data: [
              {
                type: 'requests',
                id: '41',
              },
            ],
          },
        },
      },
      {
        id: '4818',
        type: 'wells',
        attributes: {
          position: 'A1',
        },
        relationships: {
          plate: {
            data: {
              type: 'plates',
              id: '62',
            },
          },
          requests: {
            data: [
              {
                type: 'requests',
                id: '136',
              },
            ],
          },
        },
      },
      {
        id: '4819',
        type: 'wells',
        attributes: {
          position: 'B1',
        },
        relationships: {
          plate: {
            data: {
              type: 'plates',
              id: '62',
            },
          },
          requests: {
            data: [
              {
                type: 'requests',
                id: '137',
              },
            ],
          },
        },
      },
      {
        id: '40',
        type: 'requests',
        links: {
          self: '/v1/pacbio/requests/40',
        },
        attributes: {
          library_type: null,
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: null,
          external_study_id: 'fec8a1fa-b9e2-11e9-9123-fa163e99b035',
          sample_name: 'sample_DN814327C_A1',
          barcode: null,
          sample_species: 'human',
          created_at: '2021/06/03 06:59',
          source_identifier: 'DN814327C:A1',
        },
        relationships: {
          well: {
            data: [
              {
                type: 'wells',
                id: '4722',
              },
            ],
          },
          plate: {
            data: [
              {
                type: 'plates',
                id: '61',
              },
            ],
          },
        },
      },
      {
        id: '41',
        type: 'requests',
        links: {
          self: '/v1/pacbio/requests/41',
        },
        attributes: {
          library_type: null,
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: null,
          external_study_id: 'fec8a1fa-b9e2-11e9-9123-fa163e99b035',
          sample_name: 'sample_DN814327C_A2',
          barcode: null,
          sample_species: 'human',
          created_at: '2021/06/03 06:59',
          source_identifier: 'DN814327C:A2',
        },
        relationships: {
          well: {
            data: [
              {
                type: 'wells',
                id: '4723',
              },
            ],
          },
          plate: {
            data: [
              {
                type: 'plates',
                id: '61',
              },
            ],
          },
        },
      },
      {
        id: '136',
        type: 'requests',
        links: {
          self: '/v1/pacbio/requests/136',
        },
        attributes: {
          library_type: null,
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: null,
          external_study_id: 'd160363e-ba2e-11e7-b4cc-68b599768938',
          sample_name: '5049STDY8152829',
          barcode: null,
          sample_species: 'human',
          created_at: '2021/06/03 14:57',
          source_identifier: 'DN814567Q:A1',
        },
        relationships: {
          well: {
            data: [
              {
                type: 'wells',
                id: '4818',
              },
            ],
          },
          plate: {
            data: [
              {
                type: 'plates',
                id: '62',
              },
            ],
          },
        },
      },
      {
        id: '137',
        type: 'requests',
        links: {
          self: '/v1/pacbio/requests/137',
        },
        attributes: {
          library_type: null,
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: null,
          external_study_id: 'd160363e-ba2e-11e7-b4cc-68b599768938',
          sample_name: '5049STDY8152830',
          barcode: null,
          sample_species: 'cat',
          created_at: '2021/06/03 14:57',
          source_identifier: 'DN814567Q:B1',
        },
        relationships: {
          well: {
            data: [
              {
                type: 'wells',
                id: '4819',
              },
            ],
          },
          plate: {
            data: [
              {
                type: 'plates',
                id: '62',
              },
            ],
          },
        },
      },
    ],
    links: {
      first:
        'http://localhost:3100/v1/pacbio/plates?filter%5Bbarcode%5D=GEN-1680611780-1&include=wells.requests&page%5Bnumber%5D=1&page%5Bsize%5D=1000',
      last: 'http://localhost:3100/v1/pacbio/plates?filter%5Bbarcode%5D=GEN-1680611780-1&include=wells.requests&page%5Bnumber%5D=1&page%5Bsize%5D=1000',
    },
  }

  const foundData = find({ data, count, get: true })

  return { ...BaseFactory(foundData), storeData: createStoreData(foundData) }
}

export default PacbioPlateFactory
