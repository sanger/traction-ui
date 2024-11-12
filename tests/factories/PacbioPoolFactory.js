import BaseFactory from './BaseFactory.js'
import {
  dataToObjectById,
  groupIncludedByResource,
  find,
  extractAttributes,
} from './../../src/api/JsonApi'
import { createUsedAliquot } from './../../src/stores/utilities/usedAliquot.js'

/**
 *
 * @param {Object} data
 * @returns {Object} - libraries, pools, tubes, tags, requests, used_aliquots
 */
const createStoreData = (data) => {
  const pool = extractAttributes(data.data)
  const {
    aliquots = [],
    requests,
    wells,
    plates = [],
    tag_sets: [tag_set] = [{}],
    tubes = [],
    libraries = [],
  } = groupIncludedByResource(data.included)

  console.log(JSON.stringify(libraries))
  console.log(JSON.stringify(tubes))
  console.log(JSON.stringify(requests))

  const storeLibraries = dataToObjectById({ data: libraries, includeRelationships: true })
  const storeRequests = dataToObjectById({ data: requests, includeRelationships: true })
  const storeTubes = dataToObjectById({ data: tubes, includeRelationships: true })
  const storeAliquots = dataToObjectById({ data: aliquots, includeRelationships: true })

  Object.values(storeLibraries).forEach((library) => {
    const request = storeRequests[library.request]
    storeTubes[library.tube].requests = [request.id]
    storeTubes[library.tube].source_id = String(library.id)
  })

  const used_aliquots = Object.values(storeAliquots).reduce((result, aliquot) => {
    aliquot.request = aliquot.id
    const usedAliquotObject = createUsedAliquot({
      ...aliquot,
      tag_id: aliquot.tag,
    })
    usedAliquotObject.setRequestAndVolume(storeLibraries)
    return { ...result, [`_${usedAliquotObject.source_id}`]: usedAliquotObject }
  }, {})

  return {
    resources: {
      tubes: storeTubes,
      requests: storeRequests,
      libraries: storeLibraries,
      wells: dataToObjectById({ data: wells, includeRelationships: true }),
      plates: dataToObjectById({ data: plates, includeRelationships: true }),
    },
    pool,
    used_aliquots,
    selected: {
      tag_set: tag_set.id,
    },
  }
}

/*
 * Factory for creating a list of pools
 * @param {Integer} count - The number of pools to create
 * @returns a base factory object with the pools data
 */
const PacbioPoolFactory = ({ count = undefined } = {}) => {
  const data = {
    data: [
      {
        id: '6011',
        type: 'pools',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          volume: 15.0,
          concentration: 12.54,
          template_prep_kit_box_barcode: '036037102141700123124',
          insert_size: 9647,
          created_at: '2024/11/04 13:49',
          updated_at: '2024/11/04 13:49',
          used_volume: 15.0,
          available_volume: 0.0,
          source_identifier: 'TRAC-2-11876,TRAC-2-11877',
        },
        relationships: {
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/tube',
            },
            data: {
              type: 'tubes',
              id: '12066',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/used_aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '35493',
              },
              {
                type: 'aliquots',
                id: '35494',
              },
            ],
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/relationships/primary_aliquot',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/primary_aliquot',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/requests',
            },
            data: [],
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/6011/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '14160',
              },
              {
                type: 'libraries',
                id: '14159',
              },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '35493',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 14159,
          source_type: 'Pacbio::Library',
          used_by_id: 6011,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 7.5,
          concentration: 12.9,
          insert_size: 9933,
          template_prep_kit_box_barcode: '036037102141700123124',
          tag_id: 600,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/tag',
            },
            data: {
              type: 'tags',
              id: '600',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/pool',
            },
            data: {
              type: 'pools',
              id: '6011',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35493/library',
            },
          },
        },
      },
      {
        id: '35494',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 14160,
          source_type: 'Pacbio::Library',
          used_by_id: 6011,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 7.5,
          concentration: 12.2,
          insert_size: 9360,
          template_prep_kit_box_barcode: '036037102141700123124',
          tag_id: 601,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/tag',
            },
            data: {
              type: 'tags',
              id: '601',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/pool',
            },
            data: {
              type: 'pools',
              id: '6011',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/35494/library',
            },
          },
        },
      },
      {
        id: '600',
        type: 'tags',
        attributes: {
          oligo: 'CAGCGTCTACGAGTAT',
          group_id: 'bc2080',
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
        id: '601',
        type: 'tags',
        attributes: {
          oligo: 'CTACTATGTCGAGTAT',
          group_id: 'bc2081',
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
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tag_sets/9',
        },
        attributes: {
          name: 'Pacbio_96_barcode_plate_v3',
          uuid: '7a7f33e6-4912-4505-0d1e-3ceef7c93695',
          pipeline: 'pacbio',
        },
        relationships: {
          tags: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tag_sets/9/relationships/tags',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tag_sets/9/tags',
            },
            data: [
              {
                type: 'tags',
                id: '600',
              },
              {
                type: 'tags',
                id: '601',
              },
            ],
          },
        },
      },
      {
        id: '12066',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066',
        },
        attributes: {
          barcode: 'TRAC-2-12066',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066/pools',
            },
            data: [
              {
                type: 'pools',
                id: '6011',
              },
            ],
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066/libraries',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/12066/requests',
            },
          },
        },
      },
      {
        id: '11876',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876',
        },
        attributes: {
          barcode: 'TRAC-2-11876',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/libraries',
            },
            data: {
              type: 'libraries',
              id: '14159',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11876/requests',
            },
          },
        },
      },
      {
        id: '11877',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877',
        },
        attributes: {
          barcode: 'TRAC-2-11877',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/libraries',
            },
            data: {
              type: 'libraries',
              id: '14160',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11877/requests',
            },
          },
        },
      },
      {
        id: '14160',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 51.6,
          concentration: 12.2,
          template_prep_kit_box_barcode: '036037102141700123124',
          insert_size: 9360,
          created_at: '2024/10/29 09:05',
          deactivated_at: null,
          source_identifier: 'FS71986093',
          pacbio_request_id: 8951,
          tag_id: 601,
          used_volume: 7.5,
          available_volume: 44.1,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/request',
            },
            data: {
              type: 'requests',
              id: '8951',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/tag',
            },
            data: {
              type: 'tags',
              id: '601',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/tube',
            },
            data: {
              type: 'tubes',
              id: '11877',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '35029',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14160/used_aliquots',
            },
          },
        },
      },
      {
        id: '14159',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 22.3,
          concentration: 12.9,
          template_prep_kit_box_barcode: '036037102141700123124',
          insert_size: 9933,
          created_at: '2024/10/29 09:04',
          deactivated_at: null,
          source_identifier: 'FS71986813',
          pacbio_request_id: 8950,
          tag_id: 600,
          used_volume: 7.5,
          available_volume: 14.8,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/request',
            },
            data: {
              type: 'requests',
              id: '8950',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/tag',
            },
            data: {
              type: 'tags',
              id: '600',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/tube',
            },
            data: {
              type: 'tubes',
              id: '11876',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '35027',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/14159/used_aliquots',
            },
          },
        },
      },
      {
        id: '8950',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S4699',
          external_study_id: 'cf04ea86-ac82-11e9-8998-68b599768938',
          sample_name: 'DTOL15016449',
          barcode: 'FS71986813',
          sample_species: 'Aplocera plagiata',
          created_at: '2024/09/27 08:37',
          source_identifier: 'FS71986813',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8950/tube',
            },
          },
        },
      },
      {
        id: '8951',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S4699',
          external_study_id: 'cf04ea86-ac82-11e9-8998-68b599768938',
          sample_name: 'DTOL15016450',
          barcode: 'FS71986093',
          sample_species: 'Mesapamea secalis',
          created_at: '2024/09/27 08:37',
          source_identifier: 'FS71986093',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8951/tube',
            },
          },
        },
      },
    ],
  }

  // if first is completed find the data otherwise return all data
  const foundData = find({ data, count })

  return { ...BaseFactory(foundData), storeData: createStoreData(foundData) }
}

export default PacbioPoolFactory
