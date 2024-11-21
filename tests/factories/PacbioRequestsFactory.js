import BaseFactory from './BaseFactory.js'
import { dataToObjectById } from '@/api/JsonApi.js'

const createStoreData = (data) => {
  const requests = dataToObjectById({ data: data.data, includeRelationships: false })
  return {
    requests: Object.values(requests),
  }
}

const PacbioRequestsFactory = () => {
  const data = {
    data: [
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
      {
        id: '3',
        type: 'requests',
        links: {
          self: '/v1/pacbio/requests/3',
        },
        attributes: {
          library_type: null,
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S4699',
          external_study_id: '5b173660-94c9-11ec-8c89-acde48001122',
          sample_name: '2STDY97',
          barcode: '3980000001795',
          sample_species: 'Gryphon',
          created_at: '2022/03/01 10:41',
          source_identifier: '3980000001795',
        },
        relationships: {
          well: {
            links: {
              self: '/v1/pacbio/requests/3/relationships/well',
              related: '/v1/pacbio/requests/3/well',
            },
            data: null,
          },
          plate: {
            links: {
              self: '/v1/pacbio/requests/3/relationships/plate',
              related: '/v1/pacbio/requests/3/plate',
            },
          },
          tube: {
            links: {
              self: '/v1/pacbio/requests/3/relationships/tube',
              related: '/v1/pacbio/requests/3/tube',
            },
            data: {
              type: 'tubes',
              id: '1',
            },
          },
        },
      },
    ],
    included: [
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
        id: '1',
        type: 'tubes',
        links: {
          self: '/v1/pacbio/tubes/1',
        },
        attributes: {
          barcode: '3980000001795',
        },
        relationships: {
          materials: {
            links: {
              self: '/v1/pacbio/tubes/1/relationships/materials',
              related: '/v1/pacbio/tubes/1/materials',
            },
          },
          pools: {
            links: {
              self: '/v1/pacbio/tubes/1/relationships/pools',
              related: '/v1/pacbio/tubes/1/pools',
            },
          },
          requests: {
            links: {
              self: '/v1/pacbio/tubes/1/relationships/requests',
              related: '/v1/pacbio/tubes/1/requests',
            },
            data: [
              {
                type: 'requests',
                id: '3',
              },
            ],
          },
        },
      },
    ],
    meta: {
      page_count: 1,
    },
    status: 200,
    statusText: 'Success',
  }

  return { ...BaseFactory(data), storeData: createStoreData(data) }
}

export default PacbioRequestsFactory
