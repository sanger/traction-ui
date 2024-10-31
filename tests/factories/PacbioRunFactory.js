import BaseFactory from './BaseFactory.js'
import {
  dataToObjectById,
  groupIncludedByResource,
  find,
  extractAttributes,
  dataToObjectByPlateNumber,
} from './../../src/api/JsonApi'

/**
 * Get a run by state
 * @param {Array} runs - the runs to search
 * @param {String} state - the state to search for
 * @returns {Object} - the run with the state
 */
const getRunByState = (runs) => (state) => {
  return runs.find((run) => run.state === state)
}

/**
 * Create the store data for multiple runs
 * @param {Object} data - the data from the json api response
 * @returns {Object} - the store data for runs and plates along with a method to get a run by state
 */
const createStoreDataForMultipleRuns = (data) => {
  const runs = dataToObjectById({ data: data.data, includeRelationships: true })
  const { plates } = groupIncludedByResource(data.included)
  return {
    runs,
    plates: dataToObjectById({ data: plates, includeRelationships: true }),
    getRunByState: getRunByState(Object.values(runs)),
  }
}

/**
 * Create the store data for a single run
 * @param {Object} data - the data from the json api response
 * @returns {Object} - the store data for run, plates, wells, pools, libraries, tubes, aliquots, requests, tags
 * and smrt_link_version
 */
const createStoreDataForSingleRun = (data) => {
  const {
    plates,
    wells,
    pools,
    libraries,
    tubes,
    aliquots,
    requests,
    tags,
    smrt_link_versions: [smrt_link_version = {}] = [],
  } = groupIncludedByResource(data.included)

  const run = extractAttributes(data.data)

  return {
    run,
    smrtLinkVersion: extractAttributes(smrt_link_version),
    aliquots: dataToObjectById({ data: aliquots, includeRelationships: true }),
    libraries: dataToObjectById({ data: libraries, includeRelationships: true }),
    tubes: dataToObjectById({ data: tubes, includeRelationships: true }),
    pools: dataToObjectById({ data: pools, includeRelationships: true }),
    tags: dataToObjectById({ data: tags, includeRelationships: true }),
    requests: dataToObjectById({ data: requests, includeRelationships: true }),
    plates: dataToObjectByPlateNumber({ data: plates, includeRelationships: true }),
    wells: dataToObjectById({ data: wells, includeRelationships: true }),
    resources: {
      plates,
      wells,
      pools,
      libraries,
      tubes,
      aliquots,
      requests,
      tags,
      smrt_link_version,
    },
  }
}

/**
 *
 * @param {Object} data - the data from the json api response
 * @param {null | integer} first - the first n records or null for all records
 * @returns - the included data for the pools
 */
const createStoreData = (data, first) => {
  if (first === 1) {
    return createStoreDataForSingleRun(data)
  } else {
    return createStoreDataForMultipleRuns(data)
  }
}

/*
 * Factory for creating a list of runs
 * @returns a base factory object with the runs data
 */
const PacbioRunFactory = ({ all = true, first = null } = {}) => {
  const data = {
    // it would be better to pass the smrt link versions from the smrt link factory
    // so that the factory is more self-contained and is not so brittle
    data: [
      {
        id: '1',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/12',
        },
        attributes: {
          name: 'RUN-v13_revio-tagged-2_plate',
          dna_control_complex_box_barcode: 'Lxxxxx102249600123199',
          system_name: 'Revio',
          created_at: '2024/03/18 15:03',
          state: 'pending',
          comments:
            'GENSAMPLE-1710774222-37:GENSAMPLE-1710774222-38:GENSAMPLE-1710774222-39:GENSAMPLE-1710774222-40:GENSAMPLE-1710774222-37:GENSAMPLE-1710774222-38:GENSAMPLE-1710774222-39:GENSAMPLE-1710774222-40',
          pacbio_smrt_link_version_id: 5,
          plates_attributes: null,
        },
        relationships: {
          plates: {
            data: [
              {
                type: 'plates',
                id: '15',
              },
              {
                type: 'plates',
                id: '16',
              },
            ],
          },
          smrt_link_version: {
            data: {
              type: 'smrt_link_versions',
              id: '5',
            },
          },
        },
      },
      {
        id: '2',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/1',
        },
        attributes: {
          name: 'aname',
          state: 'pending',
          dna_control_complex_box_barcode: 'Lxxxxx10171760012311',
          system_name: 'Sequel IIe',
          pacbio_smrt_link_version_id: 2,
          created_at: '11/09/2019 01:11',
        },
        relationships: {
          plates: {
            data: [
              {
                type: 'plates',
                id: '2',
              },
            ],
          },
        },
      },
      {
        id: '3',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/2',
        },
        attributes: {
          name: 'anothername',
          state: 'started',
          dna_control_complex_box_barcode: 'Lxxxxx10171760012312',
          system_name: 'Sequel IIe',
          pacbio_smrt_link_version_id: 2,
          created_at: '12/09/2019 02:22',
        },
        relationships: {
          plates: {
            data: [
              {
                type: 'plates',
                id: '3',
              },
            ],
          },
        },
      },
      {
        id: '4',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/3',
        },
        attributes: {
          name: 'anothername1',
          state: 'completed',
          dna_control_complex_box_barcode: 'Lxxxxx10171760012312',
          system_name: 'Sequel IIe',
          pacbio_smrt_link_version_id: 2,
          created_at: '10/09/2019 02:22',
        },
        relationships: {
          plates: {
            data: [
              {
                type: 'plates',
                id: '4',
              },
            ],
          },
        },
      },
      {
        id: '5',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/4',
        },
        attributes: {
          name: 'anothername2',
          state: 'cancelled',
          dna_control_complex_box_barcode: 'Lxxxxx10171760012312',
          system_name: 'Revio',
          pacbio_smrt_link_version_id: 3,
          created_at: '10/09/2019 02:22',
        },
        relationships: {
          plates: {
            data: [
              {
                type: 'plates',
                id: '5',
              },
            ],
          },
        },
      },
      {
        id: '6',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/5',
        },
        attributes: {
          name: 'anothername3',
          state: 'completed',
          dna_control_complex_box_barcode: 'Lxxxxx10171760012312',
          system_name: 'Revio',
          pacbio_smrt_link_version_id: 3,
          created_at: '10/09/2019 02:22',
        },
        relationships: {
          plates: {
            data: [
              {
                type: 'plates',
                id: '6',
              },
            ],
          },
        },
      },
      {
        id: '7',
        type: 'runs',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/6',
        },
        attributes: {
          name: 'anothername4',
          state: 'started',
          dna_control_complex_box_barcode: 'Lxxxxx10171760012312',
          system_name: 'Revio',
          pacbio_smrt_link_version_id: 5,
          created_at: '10/09/2019 02:22',
        },
        relationships: {
          plates: {
            data: [
              {
                type: 'plates',
                id: '7',
              },
              {
                type: 'plates',
                id: '8',
              },
            ],
          },
        },
      },
    ],
    included: [
      {
        id: '2',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/plates/1',
        },
        attributes: {
          pacbio_run_id: 2,
          plate_number: 1,
          sequencing_kit_box_barcode: 'SKBB 1',
        },
      },
      {
        id: '3',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/plates/2',
        },
        attributes: {
          pacbio_run_id: 3,
          plate_number: 1,
          sequencing_kit_box_barcode: 'SKBB 2',
        },
      },
      {
        id: '4',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/plates/3',
        },
        attributes: {
          pacbio_run_id: 4,
          plate_number: 1,
          sequencing_kit_box_barcode: 'SKBB 3',
        },
      },
      {
        id: '5',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/plates/4',
        },
        attributes: {
          pacbio_run_id: 6,
          plate_number: 1,
          sequencing_kit_box_barcode: 'SKBB 4',
        },
      },
      {
        id: '6',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/plates/5',
        },
        attributes: {
          pacbio_run_id: 6,
          plate_number: 1,
          sequencing_kit_box_barcode: 'SKBB 5',
        },
      },
      {
        id: '7',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/plates/6',
        },
        attributes: {
          pacbio_run_id: 7,
          plate_number: 1,
          sequencing_kit_box_barcode: 'SKBB 6',
        },
      },
      {
        id: '8',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/plates/7',
        },
        attributes: {
          pacbio_run_id: 7,
          plate_number: 2,
          sequencing_kit_box_barcode: 'SKBB 7',
        },
      },
      {
        id: '15',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/plates/15',
        },
        attributes: {
          pacbio_run_id: 1,
          plate_number: 1,
          sequencing_kit_box_barcode: '1021188000311040028520240822',
        },
        relationships: {
          wells: {
            data: [
              {
                type: 'wells',
                id: '15',
              },
              {
                type: 'wells',
                id: '19',
              },
            ],
          },
        },
      },
      {
        id: '16',
        type: 'plates',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/plates/16',
        },
        attributes: {
          pacbio_run_id: 1,
          plate_number: 2,
          sequencing_kit_box_barcode: '1021188000311040028220240412',
        },
        relationships: {
          wells: {
            data: [
              {
                type: 'wells',
                id: '16',
              },
            ],
          },
        },
      },
      {
        id: '15',
        type: 'wells',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/wells/15',
        },
        attributes: {
          movie_time: null,
          insert_size: 100,
          on_plate_loading_concentration: null,
          row: 'A',
          column: '1',
          pacbio_plate_id: 15,
          comment: null,
          generate_hifi: null,
          position: 'A1',
          pre_extension_time: 2,
          ccs_analysis_output: null,
          binding_kit_box_barcode: null,
          loading_target_p1_plus_p2: null,
          ccs_analysis_output_include_low_quality_reads: null,
          include_fivemc_calls_in_cpg_motifs: null,
          ccs_analysis_output_include_kinetics_information: null,
          demultiplex_barcodes: null,
          movie_acquisition_time: '24.0',
          include_base_kinetics: 'True',
          library_concentration: 1,
          polymerase_kit: '030116102739100011124',
        },
        relationships: {
          used_aliquots: {
            data: [
              {
                type: 'aliquots',
                id: '354',
              },
              {
                type: 'aliquots',
                id: '372',
              },
            ],
          },
        },
      },
      {
        id: '16',
        type: 'wells',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/wells/16',
        },
        attributes: {
          movie_time: null,
          insert_size: 100,
          on_plate_loading_concentration: null,
          row: 'A',
          column: '1',
          pacbio_plate_id: 16,
          comment: null,
          generate_hifi: null,
          position: 'A1',
          pre_extension_time: 2,
          ccs_analysis_output: null,
          binding_kit_box_barcode: null,
          loading_target_p1_plus_p2: null,
          ccs_analysis_output_include_low_quality_reads: null,
          include_fivemc_calls_in_cpg_motifs: null,
          ccs_analysis_output_include_kinetics_information: null,
          demultiplex_barcodes: null,
          movie_acquisition_time: '24.0',
          include_base_kinetics: 'True',
          library_concentration: 1,
          polymerase_kit: '030116102739100011124',
        },
        relationships: {
          used_aliquots: {
            data: [
              {
                type: 'aliquots',
                id: '355',
              },
              {
                type: 'aliquots',
                id: '373',
              },
            ],
          },
        },
      },
      {
        id: '19',
        type: 'wells',
        links: {
          self: 'http://localhost:3100/v1/pacbio/runs/wells/19',
        },
        attributes: {
          movie_time: null,
          insert_size: 500,
          on_plate_loading_concentration: null,
          row: 'B',
          column: '1',
          pacbio_plate_id: 15,
          comment: null,
          generate_hifi: 'On Instrument',
          position: 'B1',
          pre_extension_time: 2,
          ccs_analysis_output: 'Yes',
          binding_kit_box_barcode: null,
          loading_target_p1_plus_p2: 0.85,
          ccs_analysis_output_include_low_quality_reads: 'No',
          include_fivemc_calls_in_cpg_motifs: 'Yes',
          ccs_analysis_output_include_kinetics_information: 'Yes',
          demultiplex_barcodes: 'On Instrument',
          movie_acquisition_time: '24.0',
          include_base_kinetics: 'False',
          library_concentration: '1',
          polymerase_kit: '030116102739100011124',
        },
        relationships: {
          used_aliquots: {
            data: [
              {
                type: 'aliquots',
                id: '376',
              },
            ],
          },
        },
      },
      {
        id: '354',
        type: 'aliquots',
        attributes: {
          aliquot_type: 'derived',
          source_id: 14,
          source_type: 'Pacbio::Pool',
          used_by_id: 15,
          used_by_type: 'Pacbio::Well',
          state: 'created',
          volume: 1.0,
          concentration: 1.0,
          insert_size: 100,
          template_prep_kit_box_barcode: '029979102141700063023',
          tag_id: null,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            data: {
              type: 'tags',
              id: '18',
            },
          },
          pool: {
            data: {
              type: 'pools',
              id: '14',
            },
          },
          library: {
            data: {
              type: 'libraries',
              id: '14',
            },
          },
        },
      },
      {
        id: '355',
        type: 'aliquots',
        attributes: {
          aliquot_type: 'derived',
          source_id: 14,
          source_type: 'Pacbio::Pool',
          used_by_id: 16,
          used_by_type: 'Pacbio::Well',
          state: 'created',
          volume: 1.0,
          concentration: 1.0,
          insert_size: 100,
          template_prep_kit_box_barcode: '029979102141700063023',
          tag_id: null,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            data: {
              type: 'tags',
              id: '18',
            },
          },
          pool: {
            data: {
              type: 'pools',
              id: '14',
            },
          },
          library: {
            data: {
              type: 'libraries',
              id: '14',
            },
          },
        },
      },
      {
        id: '372',
        type: 'aliquots',
        attributes: {
          aliquot_type: 'derived',
          source_id: 14,
          source_type: 'Pacbio::Pool',
          used_by_id: 15,
          used_by_type: 'Pacbio::Well',
          state: 'created',
          volume: 1.0,
          concentration: 1.0,
          insert_size: 100,
          template_prep_kit_box_barcode: '029979102141700063023',
          tag_id: null,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            data: {
              type: 'tags',
              id: '17',
            },
          },
          pool: {
            data: {
              type: 'pools',
              id: '14',
            },
          },
          library: {
            data: {
              type: 'libraries',
              id: '14',
            },
          },
        },
      },
      {
        id: '373',
        type: 'aliquots',
        attributes: {
          aliquot_type: 'derived',
          source_id: 12,
          source_type: 'Pacbio::Pool',
          used_by_id: 16,
          used_by_type: 'Pacbio::Well',
          state: 'created',
          volume: 1.0,
          concentration: 1.0,
          insert_size: 100,
          template_prep_kit_box_barcode: '029979102141700063023',
          tag_id: null,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            data: {
              type: 'tags',
              id: '18',
            },
          },
          pool: {
            data: {
              type: 'pools',
              id: '12',
            },
          },
          library: {
            data: {
              type: 'libraries',
              id: '12',
            },
          },
        },
      },
      {
        id: '376',
        type: 'aliquots',
        attributes: {
          aliquot_type: 'derived',
          source_id: 30,
          source_type: 'Pacbio::Library',
          used_by_id: 19,
          used_by_type: 'Pacbio::Well',
          state: 'created',
          volume: 1.0,
          concentration: 1.0,
          insert_size: 500,
          template_prep_kit_box_barcode: '029979102141700063023',
          tag_id: null,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            data: {
              type: 'tags',
              id: '18',
            },
          },
          pool: {
            data: null,
          },
          library: {
            data: {
              type: 'libraries',
              id: '30',
            },
          },
        },
      },
      {
        id: '14',
        type: 'libraries',
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 500,
          created_at: '2024/03/18 15:03',
          deactivated_at: null,
          source_identifier: 'GEN-1710774222-1:F2',
          pacbio_request_id: 14,
          tag_id: 1,
        },
        relationships: {
          request: {
            data: {
              type: 'requests',
              id: '14',
            },
          },
          tag: {
            data: {
              type: 'tags',
              id: '1',
            },
          },
          tube: {
            data: null,
          },
          primary_aliquot: {
            data: {
              type: 'aliquots',
              id: '282',
            },
          },
        },
      },
      {
        id: '12',
        type: 'libraries',
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 500,
          created_at: '2024/03/18 15:03',
          deactivated_at: null,
          source_identifier: 'GEN-1710774222-1:D2',
          pacbio_request_id: 12,
          tag_id: null,
        },
        relationships: {
          request: {
            data: {
              type: 'requests',
              id: '12',
            },
          },
          tag: {
            data: null,
          },
          tube: {
            data: {
              type: 'tubes',
              id: '11',
            },
          },
          primary_aliquot: {
            data: {
              type: 'aliquots',
              id: '272',
            },
          },
        },
      },
      {
        id: '30',
        type: 'libraries',
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 500,
          created_at: '2024/03/18 15:03',
          deactivated_at: null,
          source_identifier: 'GEN-1710774222-1:F4',
          pacbio_request_id: 30,
          tag_id: null,
        },
        relationships: {
          request: {
            data: {
              type: 'requests',
              id: '30',
            },
          },
          tag: {
            data: null,
          },
          tube: {
            data: {
              type: 'tubes',
              id: '20',
            },
          },
          primary_aliquot: {
            data: {
              type: 'aliquots',
              id: '314',
            },
          },
        },
      },
      {
        id: '11',
        type: 'tubes',
        attributes: {
          barcode: 'TRAC-2-11',
        },
        relationships: {
          libraries: {
            data: {
              type: 'libraries',
              id: '12',
            },
          },
        },
      },
      {
        id: '20',
        type: 'tubes',
        attributes: {
          barcode: 'TRAC-2-20',
        },
        relationships: {
          libraries: {
            data: {
              type: 'libraries',
              id: '30',
            },
          },
        },
      },
      {
        id: '22',
        type: 'tubes',
        attributes: {
          barcode: 'TRAC-2-22',
        },
        relationships: {
          pools: {
            data: [
              {
                type: 'pools',
                id: '12',
              },
            ],
          },
        },
      },
      {
        id: '24',
        type: 'tubes',
        attributes: {
          barcode: 'TRAC-2-24',
        },
        relationships: {
          pools: {
            data: [
              {
                type: 'pools',
                id: '14',
              },
            ],
          },
        },
      },
      {
        id: '14',
        type: 'pools',
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 100,
          created_at: '2024/03/18 15:03',
          updated_at: '2024/03/18 15:03',
          source_identifier: 'GEN-1710774222-1:E5-H5',
        },
        relationships: {
          tube: {
            data: {
              type: 'tubes',
              id: '24',
            },
          },
        },
      },
      {
        id: '12',
        type: 'pools',
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          volume: 1.0,
          concentration: 1.0,
          template_prep_kit_box_barcode: '029979102141700063023',
          insert_size: 100,
          created_at: '2024/03/18 15:03',
          updated_at: '2024/03/18 15:03',
          source_identifier: 'GEN-1710774222-1:H4-C5',
        },
        relationships: {
          tube: {
            data: {
              type: 'tubes',
              id: '22',
            },
          },
        },
      },
      {
        id: '5',
        type: 'smrt_link_versions',
        links: {
          self: 'http://localhost:3100/v1/pacbio/smrt_link_versions/5',
        },
        attributes: {
          name: 'v13_revio',
          default: true,
          active: true,
        },
        relationships: {
          smrt_link_option_versions: {
            links: {
              self: 'http://localhost:3100/v1/pacbio/smrt_link_versions/5/relationships/smrt_link_option_versions',
              related:
                'http://localhost:3100/v1/pacbio/smrt_link_versions/5/smrt_link_option_versions',
            },
          },
        },
      },
      {
        id: '15',
        type: 'tags',
        attributes: {
          oligo: 'TCTGTATCTCTATGTGT',
          group_id: 'bc1007T',
        },
      },
      {
        id: '16',
        type: 'tags',
        attributes: {
          oligo: 'TCTGTATCTCTATGTGT',
          group_id: 'bc1008T',
        },
      },
      {
        id: '17',
        type: 'tags',
        attributes: {
          oligo: 'CAGAGAGATATCTCTGT',
          group_id: 'bc1023T',
        },
      },
      {
        id: '18',
        type: 'tags',
        attributes: {
          oligo: 'TCTGTATCTCTATGTGT',
          group_id: 'bc1006T',
        },
      },
      {
        id: '19',
        type: 'tags',
        attributes: {
          oligo: 'CAGAGAGATATCTCTGT',
          group_id: 'bc1005T',
        },
      },
    ],
    meta: {
      page_count: 1,
    },
  }

  // if first is completed find the data otherwise return all data
  const foundData = all ? data : find({ data, all, first })

  return { ...BaseFactory(foundData), storeData: createStoreData(foundData, first) }
}

export default PacbioRunFactory
