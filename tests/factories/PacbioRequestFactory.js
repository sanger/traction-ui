import BaseFactory from './BaseFactory.js'
import { dataToObjectById } from './../../src/api/JsonApi.js'

const createStoreData = (data, includeRelationships) => {
  const requests = dataToObjectById({ data: data.data, includeRelationships })
  return {
    requestsArray: Object.values(requests),
    requests,
  }
}

const PacbioRequestFactory = ({ includeRelationships = true } = {}) => {
  const data = {
    data: [
      {
        id: '40',
        type: 'requests',
        links: {
          self: '/v1/pacbio/requests/40',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'cost-code-1',
          external_study_id: 'fec8a1fa-b9e2-11e9-9123-fa163e99b035',
          sample_name: 'sample_DN814327C_A1',
          barcode: null,
          sample_species: 'human',
          created_at: '2021/06/03 06:59',
          source_identifier: 'DN814327C:A1',
          sample_retention_instrction: 'destroy_after_2_years',
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
          sample: {
            data: {
              type: 'samples',
              id: '2',
            },
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
          library_type: 'Pacbio_HiFi_mplx',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'cost-code-2',
          external_study_id: 'fec8a1fa-b9e2-11e9-9123-fa163e99b035',
          sample_name: 'sample_DN814327C_A2',
          barcode: null,
          sample_species: 'human',
          created_at: '2021/06/03 06:59',
          source_identifier: 'DN814327C:A2',
          sample_retention_instrction: 'destroy_after_2_years',
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
          sample: {
            data: {
              type: 'samples',
              id: '3',
            },
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
          sample_retention_instrction: 'long_term_storage',
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
          sample: {
            data: {
              type: 'samples',
              id: '4',
            },
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
          sample_retention_instrction: null,
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
        sample: {
          data: {
            type: 'samples',
            id: '2',
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
          source_identifier: 'GEN-1725896371-4:B3',
          sample_retention_instrction: null,
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
          sample: {
            data: {
              type: 'samples',
              id: '3',
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
      {
        id: '2',
        type: 'samples',
        links: {
          self: '/v1/pacbio/samples/2',
        },
        attributes: {
          name: 'sample_DN814327C_A1',
          sanger_sample_id: 'id-122',
          species: 'human',
          external_id: 'external-id-122',
          date_of_sample_collection: '2021-01-01',
          supplier_name: 'Supplier Name',
          donor_id: 'donor-id-123',
          retention_instruction: null,
        },
      },
      {
        id: '3',
        type: 'samples',
        links: {
          self: '/v1/pacbio/samples/3',
        },
        attributes: {
          name: 'sample_DN814327C_A2',
          sanger_sample_id: 'id-123',
          species: 'human',
          external_id: 'external-id-123',
          date_of_sample_collection: '2021-01-03',
          supplier_name: 'Supplier Name 2',
          donor_id: 'donor-id-123',
          retention_instruction: null,
        },
      },
      {
        id: '4',
        type: 'samples',
        links: {
          self: '/v1/pacbio/samples/4',
        },
        attributes: {
          name: '5049STDY8152829',
          sanger_sample_id: 'id-124',
          species: 'human',
          external_id: 'external-id-124',
          date_of_sample_collection: '2021-01-04',
          supplier_name: 'Supplier Name 3',
          donor_id: 'donor-id-123',
          retention_instruction: null,
        },
      },
    ],
    meta: {
      page_count: 1,
    },
  }

  return { ...BaseFactory(data), storeData: createStoreData(data, includeRelationships) }
}

export default PacbioRequestFactory
