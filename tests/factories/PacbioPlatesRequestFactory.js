import BaseFactory from './BaseFactory.js'
import { dataToObjectById } from '../../src/api/JsonApi.js'
/*
 * Factory for creating a list of runs
 * @returns a base factory object with the runs data
 */
const PacbioPlatesRequestFactory = () => {
  const data = {
    data: [
      {
        id: '1',
        type: 'plates',
        links: { self: 'http://localhost:3100/v1/pacbio/plates/1' },
        attributes: {
          barcode: 'DN1',
          created_at: '2023/02/07 15:33',
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
    meta: {
      page_count: 1,
    },
  }

  /**
   * @param {Object} data
   * @returns {Object} { printers, selected { printer } }
   * creates some store data for use in tests
   */
  const createStoreData = (data) => {
    const plates = dataToObjectById({
      data: data.data,
      includeRelationships: true,
    })
    const wells = dataToObjectById({
      data: data.included.slice(0, 4),
      includeRelationships: true,
    })
    const plateRequests = dataToObjectById({
      data: data.included.slice(4, 7),
      includeRelationships: true,
    })

    const findPlatesData = {
      id: '1',
      barcode: 'DN1',
      created_at: '2023/02/07 15:33',
      wells: [
        {
          position: 'A1',
          requests: [
            {
              id: '40',
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
          ],
        },
        {
          position: 'A2',
          requests: [
            {
              id: '41',
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
          ],
        },
      ],
    }

    return {
      plates,
      wells,
      plateRequests,
      selected: {
        plate: plates['1'], // first plate
      },
      findPlatesData,
    }
  }

  return { ...BaseFactory(data), storeData: createStoreData(data) }
}

export default PacbioPlatesRequestFactory
