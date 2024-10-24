import BaseFactory from './BaseFactory.js'
import { groupIncludedByResource, dataToObjectById } from '../../src/api/JsonApi.js'

/**
 * @function createStoreData
 * @param {Object} data - The JSON API response data object.
 * @returns {Object} An object with the libraries, tubes, tags, and requests data.
 * @description A function that creates an object with the libraries, tubes, tags, and requests data.
 */
const createStoreData = ({ data, included }) => {
  const { tubes, tags, requests } = groupIncludedByResource(included)
  const libraries = dataToObjectById({ data, includeRelationships: true })

  return {
    libraries,
    tubes: dataToObjectById({ data: tubes }),
    tags: dataToObjectById({ data: tags }),
    requests: dataToObjectById({ data: requests }),
  }
}

/**
 * @function createLibrariesArray
 * @param {Object} storeData - libraries, tubes, tags, requests
 * @returns {Array} An array of libraries with sample_name, barcode, and group_id.
 * @description A function that creates an array of libraries with sample_name, barcode, and group_id.
 * This is verbatim repeating what is in the store, but it is useful to have a function that
 * does this for testing purposes. It can be used for refactoring and eventually removing the function
 */
const createLibrariesArray = ({ libraries, tubes, tags, requests }) => {
  return Object.values(libraries)
    .filter((library) => library.tube)
    .map((library) => {
      console.log(library)
      const { request, tag, ...attributes } = library
      const { sample_name } = requests[request]
      const { barcode } = tubes[library.tube]
      const { group_id } = tags[tag]

      return {
        ...attributes,
        sample_name,
        barcode,
        tag_group_id: group_id,
        tag_id: tag,
      }
    })
}

/*
 * Factory for creating a pacbio library
 * @returns a base factory object with the libraries data
 */
const PacbioLibraryFactory = ({ relationships = true } = {}) => {
  const data = {
    data: [
      {
        id: '721',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/pacbio/libraries/721',
        },
        attributes: {
          state: 'pending',
          volume: 1,
          concentration: 1,
          template_prep_kit_box_barcode: 'LK12345',
          insert_size: 100,
          created_at: '2021/06/15 10:25',
          deactivated_at: null,
          source_identifier: 'DN1:A1',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/721/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/libraries/721/request',
            },
            data: {
              type: 'requests',
              id: '481',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/721/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/libraries/721/tag',
            },
            data: {
              type: 'tags',
              id: '5',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/721/relationships/pool',
              related: 'http://localhost:3100/v1/pacbio/libraries/721/pool',
            },
            data: {
              type: 'pools',
              id: '1',
            },
          },
          tube: {
            data: {
              type: 'tubes',
              id: '721',
            },
          },
        },
      },
      {
        id: '722',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/pacbio/libraries/722',
        },
        attributes: {
          state: 'pending',
          volume: 1,
          concentration: 1,
          template_prep_kit_box_barcode: 'LK12345',
          insert_size: 100,
          created_at: '2021/06/15 10:25',
          deactivated_at: null,
          source_identifier: 'DN1:A2',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/722/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/libraries/722/request',
            },
            data: {
              type: 'requests',
              id: '482',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/722/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/libraries/722/tag',
            },
            data: {
              type: 'tags',
              id: '4',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/721/relationships/pool',
              related: 'http://localhost:3100/v1/pacbio/libraries/721/pool',
            },
            data: {
              type: 'pools',
              id: '2',
            },
          },
          tube: {
            data: {
              type: 'tubes',
              id: '722',
            },
          },
        },
      },
      {
        id: '723',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/pacbio/libraries/723',
        },
        attributes: {
          state: 'pending',
          volume: 1,
          concentration: 1,
          template_prep_kit_box_barcode: 'LK12345',
          insert_size: 100,
          created_at: '2021/06/15 10:25',
          deactivated_at: null,
          source_identifier: 'DN1:A3',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/723/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/libraries/723/request',
            },
            data: {
              type: 'requests',
              id: '483',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/723/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/libraries/723/tag',
            },
            data: {
              type: 'tags',
              id: '3',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/721/relationships/pool',
              related: 'http://localhost:3100/v1/pacbio/libraries/721/pool',
            },
            data: {
              type: 'pools',
              id: '3',
            },
          },
        },
      },
      {
        id: '724',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/pacbio/libraries/724',
        },
        attributes: {
          state: 'pending',
          volume: 1,
          concentration: 1,
          template_prep_kit_box_barcode: 'LK12345',
          insert_size: 100,
          created_at: '2021/06/15 10:25',
          deactivated_at: null,
          source_identifier: 'DN1:A4',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/724/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/libraries/724/request',
            },
            data: {
              type: 'requests',
              id: '484',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/724/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/libraries/724/tag',
            },
            data: {
              type: 'tags',
              id: '11',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/721/relationships/pool',
              related: 'http://localhost:3100/v1/pacbio/libraries/721/pool',
            },
            data: {
              type: 'pools',
              id: '4',
            },
          },
        },
      },
      {
        id: '725',
        type: 'libraries',
        links: {
          self: 'http://localhost:3100/v1/pacbio/libraries/725',
        },
        attributes: {
          state: 'pending',
          volume: 1,
          concentration: 1,
          template_prep_kit_box_barcode: 'LK12345',
          insert_size: 100,
          created_at: '2021/06/15 10:25',
          deactivated_at: null,
          source_identifier: 'DN1:A5',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          request: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/725/relationships/request',
              related: 'http://localhost:3100/v1/pacbio/libraries/725/request',
            },
            data: {
              type: 'requests',
              id: '485',
            },
          },
          tag: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/725/relationships/tag',
              related: 'http://localhost:3100/v1/pacbio/libraries/725/tag',
            },
            data: {
              type: 'tags',
              id: '2',
            },
          },
          pool: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/libraries/721/relationships/pool',
              related: 'http://localhost:3100/v1/pacbio/libraries/721/pool',
            },
            data: {
              type: 'pools',
              id: '6',
            },
          },
        },
      },
    ],
    included: [
      {
        id: '481',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/481',
        },
        attributes: {
          library_type: 'library_type_1',
          estimate_of_gb_required: 100,
          number_of_smrt_cells: 3,
          cost_code: 'PSD1234',
          external_study_id: '1',
          sample_name: 'Sample48',
          barcode: null,
          sample_species: 'human',
          created_at: '2021/06/15 10:25',
          source_identifier: 'DN1:A1',
        },
      },
      {
        id: '482',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/482',
        },
        attributes: {
          library_type: 'library_type_1',
          estimate_of_gb_required: 100,
          number_of_smrt_cells: 3,
          cost_code: 'PSD1234',
          external_study_id: '1',
          sample_name: 'Sample47',
          barcode: null,
          sample_species: 'human',
          created_at: '2021/06/15 10:25',
          source_identifier: 'DN1:A2',
        },
      },
      {
        id: '483',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/483',
        },
        attributes: {
          library_type: 'library_type_1',
          estimate_of_gb_required: 100,
          number_of_smrt_cells: 3,
          cost_code: 'PSD1234',
          external_study_id: '1',
          sample_name: 'Sample46',
          barcode: null,
          sample_species: 'human',
          created_at: '2021/06/15 10:25',
          source_identifier: 'DN1:A3',
        },
      },
      {
        id: '484',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/484',
        },
        attributes: {
          library_type: 'library_type_1',
          estimate_of_gb_required: 100,
          number_of_smrt_cells: 3,
          cost_code: 'PSD1234',
          external_study_id: '1',
          sample_name: 'Sample45',
          barcode: null,
          sample_species: 'human',
          created_at: '2021/06/15 10:25',
          source_identifier: 'DN1:A4',
        },
      },
      {
        id: '485',
        type: 'requests',
        links: {
          self: 'http://localhost:3100/v1/pacbio/requests/485',
        },
        attributes: {
          library_type: 'library_type_1',
          estimate_of_gb_required: 100,
          number_of_smrt_cells: 3,
          cost_code: 'PSD1234',
          external_study_id: '1',
          sample_name: 'Sample44',
          barcode: null,
          sample_species: 'human',
          created_at: '2021/06/15 10:25',
          source_identifier: 'DN1:A5',
        },
      },
      {
        id: '2',
        type: 'tags',
        attributes: {
          oligo: 'ACACACAGACTGTGAGT',
          group_id: 'bc1002_BAK8A_OA',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '1',
            },
          },
        },
      },
      {
        id: '3',
        type: 'tags',
        attributes: {
          oligo: 'ACACATCTCGTGAGAGT',
          group_id: 'bc1003_BAK8A_OA',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '1',
            },
          },
        },
      },
      {
        id: '4',
        type: 'tags',
        attributes: {
          oligo: 'ACAGTCGAGCGCTGCGT',
          group_id: 'bc1008_BAK8A_OA',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '1',
            },
          },
        },
      },
      {
        id: '5',
        type: 'tags',
        attributes: {
          oligo: 'ACACACGCGAGACAGAT',
          group_id: 'bc1009_BAK8A_OA',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '1',
            },
          },
        },
      },
      {
        id: '11',
        type: 'tags',
        attributes: {
          oligo: 'CACACGCGCGCTATATT',
          group_id: 'bc1017_BAK8B_OA',
        },
        relationships: {
          tag_set: {
            data: {
              type: 'tag_sets',
              id: '1',
            },
          },
        },
      },
      {
        id: '1',
        type: 'tag_sets',
        attributes: {
          name: 'Sequel_16_barcodes_v3',
          uuid: '4d87a8ab-4d16-f0b0-77e5-0f467dba442e',
        },
      },
      {
        id: '721',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/pacbio/tubes/721',
        },
        attributes: {
          barcode: 'TRAC-2-721',
        },
        relationships: {
          materials: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/721/relationships/materials',
              related: 'http://localhost:3100/v1/pacbio/tubes/721/materials',
            },
          },
        },
      },
      {
        id: '722',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/pacbio/tubes/722',
        },
        attributes: {
          barcode: 'TRAC-2-722',
        },
        relationships: {
          materials: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/722/relationships/materials',
              related: 'http://localhost:3100/v1/pacbio/tubes/722/materials',
            },
          },
        },
      },
      {
        id: '723',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/pacbio/tubes/723',
        },
        attributes: {
          barcode: 'TRAC-2-723',
        },
        relationships: {
          materials: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/723/relationships/materials',
              related: 'http://localhost:3100/v1/pacbio/tubes/723/materials',
            },
          },
        },
      },
      {
        id: '724',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/pacbio/tubes/724',
        },
        attributes: {
          barcode: 'TRAC-2-724',
        },
        relationships: {
          materials: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/724/relationships/materials',
              related: 'http://localhost:3100/v1/pacbio/tubes/724/materials',
            },
          },
        },
      },
      {
        id: '725',
        type: 'tubes',
        links: {
          self: 'http://localhost:3100/v1/pacbio/tubes/725',
        },
        attributes: {
          barcode: 'TRAC-2-725',
        },
        relationships: {
          materials: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/tubes/725/relationships/materials',
              related: 'http://localhost:3100/v1/pacbio/tubes/725/materials',
            },
          },
        },
      },
      {
        id: '1',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/pacbio/pools/1',
        },
        attributes: {
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '2424',
          insert_size: 1,
          source_identifier: 'DN1:A4',
          created_at: '2021-07-23T10:15:37.000Z',
          updated_at: '2021-07-23T10:15:37.000Z',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tube: {
            data: {
              type: 'tubes',
              id: '721',
            },
          },
        },
      },
      {
        id: '2',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/pacbio/pools/2',
        },
        attributes: {
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '2424',
          insert_size: 1,
          source_identifier: 'DN1:A5',
          created_at: '2021-07-23T10:15:37.000Z',
          updated_at: '2021-07-23T10:15:37.000Z',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tube: {
            data: {
              type: 'tubes',
              id: '722',
            },
          },
        },
      },
      {
        id: '3',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/pacbio/pools/3',
        },
        attributes: {
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '2424',
          insert_size: 1,
          source_identifier: 'DN2:A6',
          created_at: '2021-07-23T10:15:37.000Z',
          updated_at: '2021-07-23T10:15:37.000Z',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tube: {
            data: {
              type: 'tubes',
              id: '723',
            },
          },
        },
      },
      {
        id: '4',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/pacbio/pools/4',
        },
        attributes: {
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '2424',
          insert_size: 1,
          source_identifier: 'DN1:A1',
          created_at: '2021-07-23T10:15:37.000Z',
          updated_at: '2021-07-23T10:15:37.000Z',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tube: {
            data: {
              type: 'tubes',
              id: '724',
            },
          },
        },
      },
      {
        id: '6',
        type: 'pools',
        links: {
          self: 'http://localhost:3100/v1/pacbio/pools/6',
        },
        attributes: {
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '2424',
          insert_size: 1,
          source_identifier: 'DN1:A12',
          created_at: '2021-07-23T10:15:37.000Z',
          updated_at: '2021-07-23T10:15:37.000Z',
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tube: {
            data: {
              type: 'tubes',
              id: '725',
            },
          },
        },
      },
    ],
  }

  // certain tests require data with no relationships
  if (relationships) {
    const storeData = createStoreData(data)
    const librariesArray = createLibrariesArray(storeData)
    return { ...BaseFactory(data), storeData, librariesArray }
  } else {
    // take all the relationships out of the data
    const dataWithoutRelationships = data.data.map(({ id, type, attributes }) => ({
      id,
      type,
      attributes,
    }))
    const foundData = { data: dataWithoutRelationships, included: [] }
    const storeData = createStoreData(foundData)
    return { ...BaseFactory(foundData), storeData }
  }
}

export default PacbioLibraryFactory
