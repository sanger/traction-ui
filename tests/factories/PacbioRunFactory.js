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
 * @param {undefined | integer} first - the number of records
 * @returns - the included data for the pools
 */
const createStoreData = (data, count) => {
  if (count === 1) {
    return createStoreDataForSingleRun(data)
  } else {
    return createStoreDataForMultipleRuns(data)
  }
}

const getData = (data, findBy, count) => {
  const computedCount = findBy ? 1 : count
  const index = findBy ? data.data.findIndex((run) => run.attributes.system_name === findBy) : 0
  const foundData = find({ data, start: index, count: computedCount, maximumDepth: 8 })
  return { ...BaseFactory(foundData), storeData: createStoreData(foundData, computedCount) }
}

/*
 * Factory for creating a list of runs
 * @returns a base factory object with the runs data
 * it would be better to be able to search for pools and libraries.
 */
const PacbioRunFactory = ({ count = undefined, findBy = null } = {}) => {
  const data = {
    // it would be better to pass the smrt link versions from the smrt link factory
    // so that the factory is more self-contained and is not so brittle
    data: [
      {
        id: '1581',
        type: 'runs',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/runs/1581',
        },
        attributes: {
          name: 'TRACTION-RUN-1581',
          dna_control_complex_box_barcode: null,
          system_name: 'Revio',
          created_at: '2024/10/21 13:06',
          state: 'pending',
          comments:
            ' TRAC-2-10185 212pM  TRAC-2-11561 258pM  TRAC-2-11562 197pM  TRAC-2-11563 221pM',
          pacbio_smrt_link_version_id: 5,
          plates_attributes: null,
          adaptive_loading: false,
          sequencing_kit_box_barcodes: ['Plate 1: skbb-1', 'Plate 2: skbb-2'],
        },
        relationships: {
          plates: {
            data: [
              {
                type: 'plates',
                id: '1706',
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
        id: '1503',
        type: 'runs',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/runs/1503',
        },
        attributes: {
          name: 'TRACTION-RUN-1503',
          dna_control_complex_box_barcode: 'Lxxxxx102249600123199',
          system_name: 'Sequel IIe',
          created_at: '2024/09/12 11:31',
          state: 'pending',
          comments: ' TRAC-2-10797 81pM  TRAC-2-9452 81pM  TRAC-2-10748 81pM  TRAC-2-10483 77pM',
          pacbio_smrt_link_version_id: 4,
          plates_attributes: null,
          adaptive_loading: false,
          sequencing_kit_box_barcodes: ['Plate 1: skbb-1'],
        },
        relationships: {
          plates: {
            data: [
              {
                type: 'plates',
                id: '1614',
              },
            ],
          },
          smrt_link_version: {
            data: {
              type: 'smrt_link_versions',
              id: '4',
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
          adaptive_loading: false,
          sequencing_kit_box_barcodes: ['Plate 1: skbb-1'],
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
          adaptive_loading: false,
          sequencing_kit_box_barcodes: ['Plate 1: skbb-1'],
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
          adaptive_loading: false,
          sequencing_kit_box_barcodes: ['Plate 1: skbb-1'],
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
          adaptive_loading: false,
          sequencing_kit_box_barcodes: ['Plate 1: skbb-1', 'Plate 2: skbb-2'],
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
          adaptive_loading: false,
          sequencing_kit_box_barcodes: ['Plate 1: skbb-1', 'Plate 2: skbb-2'],
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
          adaptive_loading: false,
          sequencing_kit_box_barcodes: ['Plate 1: skbb-1', 'Plate 2: skbb-2'],
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
        id: '1706',
        type: 'plates',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/runs/plates/1706',
        },
        attributes: {
          pacbio_run_id: 1581,
          plate_number: 1,
          sequencing_kit_box_barcode: '1021188000361740028020250321',
        },
        relationships: {
          wells: {
            data: [
              {
                type: 'wells',
                id: '6909',
              },
              {
                type: 'wells',
                id: '6910',
              },
              {
                type: 'wells',
                id: '6911',
              },
              {
                type: 'wells',
                id: '6912',
              },
            ],
          },
        },
      },
      {
        id: '6909',
        type: 'wells',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/runs/wells/6909',
        },
        attributes: {
          row: 'A',
          column: '1',
          comment: null,
          pacbio_plate_id: 1706,
          position: 'A1',
          ccs_analysis_output: 'Yes',
          generate_hifi: 'On Instrument',
          ccs_analysis_output_include_kinetics_information: 'Yes',
          ccs_analysis_output_include_low_quality_reads: 'No',
          include_fivemc_calls_in_cpg_motifs: 'Yes',
          demultiplex_barcodes: 'On Instrument',
          on_plate_loading_concentration: null,
          binding_kit_box_barcode: null,
          pre_extension_time: 2,
          loading_target_p1_plus_p2: 0.85,
          movie_time: null,
          movie_acquisition_time: '24.0',
          include_base_kinetics: 'False',
          library_concentration: '212',
          polymerase_kit: '035781102739100022825',
          library_type: 'Standard',
        },
        relationships: {
          used_aliquots: {
            data: [
              {
                type: 'aliquots',
                id: '34768',
              },
            ],
          },
          libraries: {
            data: [
              {
                type: 'libraries',
                id: '13239',
              },
            ],
          },
          pools: {
            data: [],
          },
        },
      },
      {
        id: '6910',
        type: 'wells',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/runs/wells/6910',
        },
        attributes: {
          row: 'B',
          column: '1',
          comment: null,
          pacbio_plate_id: 1706,
          position: 'B1',
          ccs_analysis_output: 'Yes',
          generate_hifi: 'On Instrument',
          ccs_analysis_output_include_kinetics_information: 'Yes',
          ccs_analysis_output_include_low_quality_reads: 'No',
          include_fivemc_calls_in_cpg_motifs: 'Yes',
          demultiplex_barcodes: 'On Instrument',
          on_plate_loading_concentration: null,
          binding_kit_box_barcode: null,
          pre_extension_time: 2,
          loading_target_p1_plus_p2: 0.85,
          movie_time: null,
          movie_acquisition_time: '24.0',
          include_base_kinetics: 'False',
          library_concentration: '258',
          polymerase_kit: '035781102739100022825',
          library_type: 'Standard',
        },
        relationships: {
          used_aliquots: {
            data: [
              {
                type: 'aliquots',
                id: '34769',
              },
            ],
          },
          libraries: {
            data: [
              {
                type: 'libraries',
                id: '13976',
              },
            ],
          },
          pools: {
            data: [],
          },
        },
      },
      {
        id: '6911',
        type: 'wells',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/runs/wells/6911',
        },
        attributes: {
          row: 'C',
          column: '1',
          comment: null,
          pacbio_plate_id: 1706,
          position: 'C1',
          ccs_analysis_output: 'Yes',
          generate_hifi: 'On Instrument',
          ccs_analysis_output_include_kinetics_information: 'Yes',
          ccs_analysis_output_include_low_quality_reads: 'No',
          include_fivemc_calls_in_cpg_motifs: 'Yes',
          demultiplex_barcodes: 'On Instrument',
          on_plate_loading_concentration: null,
          binding_kit_box_barcode: null,
          pre_extension_time: 2,
          loading_target_p1_plus_p2: 0.85,
          movie_time: null,
          movie_acquisition_time: '24.0',
          include_base_kinetics: 'False',
          library_concentration: '197',
          polymerase_kit: '035781102739100022825',
          library_type: 'Standard',
        },
        relationships: {
          used_aliquots: {
            data: [
              {
                type: 'aliquots',
                id: '34770',
              },
            ],
          },
          libraries: {
            data: [
              {
                type: 'libraries',
                id: '13977',
              },
            ],
          },
          pools: {
            data: [],
          },
        },
      },
      {
        id: '6912',
        type: 'wells',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/runs/wells/6912',
        },
        attributes: {
          row: 'D',
          column: '1',
          comment: null,
          pacbio_plate_id: 1706,
          position: 'D1',
          ccs_analysis_output: 'Yes',
          generate_hifi: 'On Instrument',
          ccs_analysis_output_include_kinetics_information: 'Yes',
          ccs_analysis_output_include_low_quality_reads: 'No',
          include_fivemc_calls_in_cpg_motifs: 'Yes',
          demultiplex_barcodes: 'On Instrument',
          on_plate_loading_concentration: null,
          binding_kit_box_barcode: null,
          pre_extension_time: 2,
          loading_target_p1_plus_p2: 0.85,
          movie_time: null,
          movie_acquisition_time: '24.0',
          include_base_kinetics: 'False',
          library_concentration: '221',
          polymerase_kit: '035781102739100022825',
          library_type: 'Standard',
        },
        relationships: {
          used_aliquots: {
            data: [
              {
                type: 'aliquots',
                id: '34771',
              },
            ],
          },
          libraries: {
            data: [
              {
                type: 'libraries',
                id: '13978',
              },
            ],
          },
          pools: {
            data: [],
          },
        },
      },
      {
        id: '34768',
        type: 'aliquots',
        attributes: {
          aliquot_type: 'derived',
          source_id: 13239,
          source_type: 'Pacbio::Library',
          used_by_id: 6909,
          used_by_type: 'Pacbio::Well',
          state: 'created',
          volume: 12.5,
          concentration: 24.1,
          insert_size: 100,
          template_prep_kit_box_barcode: '035628102141700123124',
          tag_id: null,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            data: null,
          },
        },
      },
      {
        id: '34769',
        type: 'aliquots',
        attributes: {
          aliquot_type: 'derived',
          source_id: 13976,
          source_type: 'Pacbio::Library',
          used_by_id: 6910,
          used_by_type: 'Pacbio::Well',
          state: 'created',
          volume: 15.0,
          concentration: 13.6,
          insert_size: 100,
          template_prep_kit_box_barcode: '036037102141700123124',
          tag_id: null,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            data: null,
          },
        },
      },
      {
        id: '34770',
        type: 'aliquots',
        attributes: {
          aliquot_type: 'derived',
          source_id: 13977,
          source_type: 'Pacbio::Library',
          used_by_id: 6911,
          used_by_type: 'Pacbio::Well',
          state: 'created',
          volume: 11.3,
          concentration: 13.5,
          insert_size: 100,
          template_prep_kit_box_barcode: '036037102141700123124',
          tag_id: null,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            data: null,
          },
        },
      },
      {
        id: '34771',
        type: 'aliquots',
        attributes: {
          aliquot_type: 'derived',
          source_id: 13978,
          source_type: 'Pacbio::Library',
          used_by_id: 6912,
          used_by_type: 'Pacbio::Well',
          state: 'created',
          volume: 15.0,
          concentration: 20.9,
          insert_size: 100,
          template_prep_kit_box_barcode: '036037102141700123124',
          tag_id: null,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            data: null,
          },
        },
      },
      {
        id: '13978',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13978',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 21.6,
          concentration: 20.9,
          template_prep_kit_box_barcode: '036037102141700123124',
          insert_size: 16074,
          created_at: '2024/10/14 13:47',
          deactivated_at: null,
          source_identifier: 'SQPP-63568-I:A1',
          pacbio_request_id: 9132,
          tag_id: 584,
          used_volume: 15.0,
          available_volume: 6.6,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13978/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13978/request',
            },
            data: {
              type: 'requests',
              id: '9132',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13978/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13978/tag',
            },
            data: {
              type: 'tags',
              id: '584',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13978/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13978/tube',
            },
            data: {
              type: 'tubes',
              id: '11563',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13978/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13978/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13978/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13978/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13978/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13978/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '34161',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13978/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13978/used_aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '34162',
              },
            ],
          },
        },
      },
      {
        id: '13977',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13977',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 11.3,
          concentration: 13.5,
          template_prep_kit_box_barcode: '036037102141700123124',
          insert_size: 10382,
          created_at: '2024/10/14 13:46',
          deactivated_at: null,
          source_identifier: 'SQPP-63554-C:B1',
          pacbio_request_id: 9160,
          tag_id: 583,
          used_volume: 11.3,
          available_volume: 0.0,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13977/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13977/request',
            },
            data: {
              type: 'requests',
              id: '9160',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13977/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13977/tag',
            },
            data: {
              type: 'tags',
              id: '583',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13977/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13977/tube',
            },
            data: {
              type: 'tubes',
              id: '11562',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13977/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13977/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13977/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13977/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13977/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13977/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '34159',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13977/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13977/used_aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '34160',
              },
            ],
          },
        },
      },
      {
        id: '13976',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13976',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 37.6,
          concentration: 13.6,
          template_prep_kit_box_barcode: '036037102141700123124',
          insert_size: 10475,
          created_at: '2024/10/14 13:45',
          deactivated_at: null,
          source_identifier: 'SQPP-61714-P:A1',
          pacbio_request_id: 9086,
          tag_id: 582,
          used_volume: 15.0,
          available_volume: 22.6,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13976/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13976/request',
            },
            data: {
              type: 'requests',
              id: '9086',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13976/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13976/tag',
            },
            data: {
              type: 'tags',
              id: '582',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13976/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13976/tube',
            },
            data: {
              type: 'tubes',
              id: '11561',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13976/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13976/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13976/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13976/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13976/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13976/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '34157',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13976/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13976/used_aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '34158',
              },
            ],
          },
        },
      },
      {
        id: '13239',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13239',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 42.5,
          concentration: 24.1,
          template_prep_kit_box_barcode: '035628102141700123124',
          insert_size: 18500,
          created_at: '2024/08/01 13:03',
          deactivated_at: null,
          source_identifier: 'SQPP-55882-S:D2',
          pacbio_request_id: 8070,
          tag_id: 608,
          used_volume: 42.5,
          available_volume: 0.0,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13239/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13239/request',
            },
            data: {
              type: 'requests',
              id: '8070',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13239/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13239/tag',
            },
            data: {
              type: 'tags',
              id: '608',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13239/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13239/tube',
            },
            data: {
              type: 'tubes',
              id: '10185',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13239/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13239/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13239/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13239/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13239/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13239/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '30055',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13239/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13239/used_aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '30056',
              },
            ],
          },
        },
      },
      {
        id: '10185',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10185',
        },
        attributes: {
          barcode: 'TRAC-2-10185',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10185/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10185/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10185/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10185/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10185/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10185/libraries',
            },
            data: {
              type: 'libraries',
              id: '13239',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10185/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10185/requests',
            },
          },
        },
      },
      {
        id: '11561',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11561',
        },
        attributes: {
          barcode: 'TRAC-2-11561',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11561/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11561/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11561/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11561/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11561/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11561/libraries',
            },
            data: {
              type: 'libraries',
              id: '13976',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11561/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11561/requests',
            },
          },
        },
      },
      {
        id: '11562',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11562',
        },
        attributes: {
          barcode: 'TRAC-2-11562',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11562/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11562/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11562/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11562/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11562/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11562/libraries',
            },
            data: {
              type: 'libraries',
              id: '13977',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11562/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11562/requests',
            },
          },
        },
      },
      {
        id: '11563',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11563',
        },
        attributes: {
          barcode: 'TRAC-2-11563',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11563/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11563/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11563/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11563/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11563/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11563/libraries',
            },
            data: {
              type: 'libraries',
              id: '13978',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11563/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/11563/requests',
            },
          },
        },
      },
      {
        id: '9160',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9160',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S10740',
          external_study_id: 'd2584c0e-78c1-11ee-93ff-024293460e78',
          sample_name: 'BGE_ERGA_DNA15124976',
          barcode: null,
          sample_species: 'Conus guanche',
          created_at: '2024/10/04 14:00',
          source_identifier: 'SQPP-63554-C:B1',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9160/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9160/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9160/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9160/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9160/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9160/tube',
            },
          },
        },
      },
      {
        id: '9132',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9132',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S4698',
          external_study_id: 'dbfc7680-7941-11ec-bf7f-fa163eea3084',
          sample_name: '6771STDY15125359',
          barcode: null,
          sample_species: 'Clinocardium nuttallii',
          created_at: '2024/10/04 13:52',
          source_identifier: 'SQPP-63568-I:A1',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9132/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9132/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9132/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9132/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9132/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9132/tube',
            },
          },
        },
      },
      {
        id: '9086',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9086',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S4699',
          external_study_id: 'cf04ea86-ac82-11e9-8998-68b599768938',
          sample_name: 'DTOL15079697',
          barcode: null,
          sample_species: 'Larus hyperboreus',
          created_at: '2024/10/04 13:46',
          source_identifier: 'SQPP-61714-P:A1',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9086/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9086/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9086/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9086/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9086/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/9086/tube',
            },
          },
        },
      },
      {
        id: '8070',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8070',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S4699',
          external_study_id: 'cf04ea86-ac82-11e9-8998-68b599768938',
          sample_name: 'DTOL14860770',
          barcode: null,
          sample_species: 'Fritillaria meleagris',
          created_at: '2024/07/26 12:39',
          source_identifier: 'SQPP-55882-S:D2',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8070/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8070/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8070/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8070/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8070/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8070/tube',
            },
          },
        },
      },
      {
        id: '30056',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30056',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 8070,
          source_type: 'Pacbio::Request',
          used_by_id: 13239,
          used_by_type: 'Pacbio::Library',
          state: 'created',
          volume: 42.5,
          concentration: 24.1,
          insert_size: 18500,
          template_prep_kit_box_barcode: '035628102141700123124',
          tag_id: 608,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30056/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30056/tag',
            },
            data: {
              type: 'tags',
              id: '608',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30056/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30056/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30056/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30056/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30056/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30056/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30056/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30056/pool',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30056/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30056/library',
            },
            data: {
              type: 'libraries',
              id: '13239',
            },
          },
        },
      },
      {
        id: '34158',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34158',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 9086,
          source_type: 'Pacbio::Request',
          used_by_id: 13976,
          used_by_type: 'Pacbio::Library',
          state: 'created',
          volume: 37.6,
          concentration: 13.6,
          insert_size: 10475,
          template_prep_kit_box_barcode: '036037102141700123124',
          tag_id: 582,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34158/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34158/tag',
            },
            data: {
              type: 'tags',
              id: '582',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34158/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34158/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34158/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34158/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34158/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34158/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34158/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34158/pool',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34158/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34158/library',
            },
            data: {
              type: 'libraries',
              id: '13976',
            },
          },
        },
      },
      {
        id: '34160',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34160',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 9160,
          source_type: 'Pacbio::Request',
          used_by_id: 13977,
          used_by_type: 'Pacbio::Library',
          state: 'created',
          volume: 11.3,
          concentration: 13.5,
          insert_size: 10382,
          template_prep_kit_box_barcode: '036037102141700123124',
          tag_id: 583,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34160/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34160/tag',
            },
            data: {
              type: 'tags',
              id: '583',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34160/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34160/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34160/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34160/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34160/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34160/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34160/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34160/pool',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34160/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34160/library',
            },
            data: {
              type: 'libraries',
              id: '13977',
            },
          },
        },
      },
      {
        id: '34162',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34162',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 9132,
          source_type: 'Pacbio::Request',
          used_by_id: 13978,
          used_by_type: 'Pacbio::Library',
          state: 'created',
          volume: 21.6,
          concentration: 20.9,
          insert_size: 16074,
          template_prep_kit_box_barcode: '036037102141700123124',
          tag_id: 584,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34162/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34162/tag',
            },
            data: {
              type: 'tags',
              id: '584',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34162/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34162/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34162/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34162/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34162/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34162/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34162/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34162/pool',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34162/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/34162/library',
            },
            data: {
              type: 'libraries',
              id: '13978',
            },
          },
        },
      },
      {
        id: '582',
        type: 'tags',
        attributes: {
          oligo: 'TCTGCGTATCGAGTAT',
          group_id: 'bc2062',
        },
      },
      {
        id: '583',
        type: 'tags',
        attributes: {
          oligo: 'TCTGCATCATGAGTAT',
          group_id: 'bc2063',
        },
      },
      {
        id: '584',
        type: 'tags',
        attributes: {
          oligo: 'TGCGTGATGCGAGTAT',
          group_id: 'bc2064',
        },
      },
      {
        id: '608',
        type: 'tags',
        attributes: {
          oligo: 'ACGCTCATGCGAGTAT',
          group_id: 'bc2088',
        },
      },
      {
        id: '5',
        type: 'smrt_link_versions',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/smrt_link_versions/5',
        },
        attributes: {
          name: 'v13_revio',
          default: true,
          active: true,
        },
        relationships: {
          smrt_link_option_versions: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/smrt_link_versions/5/relationships/smrt_link_option_versions',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/smrt_link_versions/5/smrt_link_option_versions',
            },
          },
        },
      },
      {
        id: '1614',
        type: 'plates',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/runs/plates/1614',
        },
        attributes: {
          pacbio_run_id: 1503,
          plate_number: 1,
          sequencing_kit_box_barcode: '135330101826100011725',
        },
        relationships: {
          wells: {
            data: [
              {
                type: 'wells',
                id: '6552',
              },
              {
                type: 'wells',
                id: '6553',
              },
              {
                type: 'wells',
                id: '6554',
              },
              {
                type: 'wells',
                id: '6555',
              },
            ],
          },
        },
      },
      {
        id: '6552',
        type: 'wells',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/runs/wells/6552',
        },
        attributes: {
          row: 'A',
          column: '1',
          comment: null,
          pacbio_plate_id: 1614,
          position: 'A1',
          ccs_analysis_output: 'Yes',
          generate_hifi: 'On Instrument',
          ccs_analysis_output_include_kinetics_information: 'No',
          ccs_analysis_output_include_low_quality_reads: 'No',
          include_fivemc_calls_in_cpg_motif: 'No',
          demultiplex_barcodes: 'On Instrument',
          on_plate_loading_concentration: '81',
          binding_kit_box_barcode: '602630102194100071224',
          pre_extension_time: 2,
          loading_target_p1_plus_p2: 0.85,
          movie_time: '24.0',
          movie_acquisition_time: '24.0',
          include_base_kinetics: 'False',
          library_concentration: null,
          polymerase_kit: null,
          library_type: 'Standard',
        },
        relationships: {
          used_aliquots: {
            data: [
              {
                type: 'aliquots',
                id: '32184',
              },
            ],
          },
          libraries: {
            data: [],
          },
          pools: {
            data: [
              {
                type: 'pools',
                id: '5817',
              },
            ],
          },
        },
      },
      {
        id: '6553',
        type: 'wells',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/runs/wells/6553',
        },
        attributes: {
          row: 'B',
          column: '1',
          comment: null,
          pacbio_plate_id: 1614,
          position: 'B1',
          ccs_analysis_output: 'Yes',
          generate_hifi: 'On Instrument',
          ccs_analysis_output_include_kinetics_information: 'No',
          ccs_analysis_output_include_low_quality_reads: 'No',
          include_fivemc_calls_in_cpg_motif: 'No',
          demultiplex_barcodes: 'On Instrument',
          on_plate_loading_concentration: '81',
          binding_kit_box_barcode: '602630102194100071224',
          pre_extension_time: 2,
          loading_target_p1_plus_p2: 0.85,
          movie_time: '24.0',
          movie_acquisition_time: '24.0',
          include_base_kinetics: 'False',
          library_concentration: null,
          polymerase_kit: null,
          library_type: 'Standard',
        },
        relationships: {
          used_aliquots: {
            data: [
              {
                type: 'aliquots',
                id: '32185',
              },
            ],
          },
          libraries: {
            data: [
              {
                type: 'libraries',
                id: '12739',
              },
            ],
          },
          pools: {
            data: [],
          },
        },
      },
      {
        id: '6554',
        type: 'wells',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/runs/wells/6554',
        },
        attributes: {
          row: 'C',
          column: '1',
          comment: null,
          pacbio_plate_id: 1614,
          position: 'C1',
          ccs_analysis_output: 'Yes',
          generate_hifi: 'On Instrument',
          ccs_analysis_output_include_kinetics_information: 'No',
          ccs_analysis_output_include_low_quality_reads: 'No',
          include_fivemc_calls_in_cpg_motif: 'No',
          demultiplex_barcodes: 'On Instrument',
          on_plate_loading_concentration: '81',
          binding_kit_box_barcode: '602630102194100071224',
          pre_extension_time: 2,
          loading_target_p1_plus_p2: 0.85,
          movie_time: '24.0',
          movie_acquisition_time: '24.0',
          include_base_kinetics: 'False',
          library_concentration: null,
          polymerase_kit: null,
          library_type: 'Standard',
        },
        relationships: {
          used_aliquots: {
            data: [
              {
                type: 'aliquots',
                id: '32186',
              },
            ],
          },
          libraries: {
            data: [
              {
                type: 'libraries',
                id: '13462',
              },
            ],
          },
          pools: {
            data: [],
          },
        },
      },
      {
        id: '6555',
        type: 'wells',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/runs/wells/6555',
        },
        attributes: {
          row: 'D',
          column: '1',
          comment: null,
          pacbio_plate_id: 1614,
          position: 'D1',
          ccs_analysis_output: 'Yes',
          generate_hifi: 'On Instrument',
          ccs_analysis_output_include_kinetics_information: 'No',
          ccs_analysis_output_include_low_quality_reads: 'No',
          include_fivemc_calls_in_cpg_motif: 'No',
          demultiplex_barcodes: 'Do Not Generate',
          on_plate_loading_concentration: '77',
          binding_kit_box_barcode: '602630102194100071224',
          pre_extension_time: 2,
          loading_target_p1_plus_p2: 0.85,
          movie_time: '24.0',
          movie_acquisition_time: '24.0',
          include_base_kinetics: 'False',
          library_concentration: null,
          polymerase_kit: null,
          library_type: 'Standard',
        },
        relationships: {
          used_aliquots: {
            data: [
              {
                type: 'aliquots',
                id: '32187',
              },
            ],
          },
          libraries: {
            data: [
              {
                type: 'libraries',
                id: '13357',
              },
            ],
          },
          pools: {
            data: [],
          },
        },
      },
      {
        id: '32184',
        type: 'aliquots',
        attributes: {
          aliquot_type: 'derived',
          source_id: 5817,
          source_type: 'Pacbio::Pool',
          used_by_id: 6552,
          used_by_type: 'Pacbio::Well',
          state: 'created',
          volume: 9.0,
          concentration: 12.21,
          insert_size: null,
          template_prep_kit_box_barcode: '034451102141700063024',
          tag_id: null,
          run_suitability: {
            ready_for_run: false,
            errors: [
              {
                title: "can't be blank",
                detail: "insert_size - can't be blank",
                code: '100',
                source: {
                  pointer: '/data/attributes/insert_size',
                },
              },
            ],
          },
        },
        relationships: {
          tag: {
            data: null,
          },
        },
      },
      {
        id: '32185',
        type: 'aliquots',
        attributes: {
          aliquot_type: 'derived',
          source_id: 12739,
          source_type: 'Pacbio::Library',
          used_by_id: 6553,
          used_by_type: 'Pacbio::Well',
          state: 'created',
          volume: 7.0,
          concentration: 10.5,
          insert_size: null,
          template_prep_kit_box_barcode: '035092100938900103124',
          tag_id: null,
          run_suitability: {
            ready_for_run: false,
            errors: [
              {
                title: "can't be blank",
                detail: "insert_size - can't be blank",
                code: '100',
                source: {
                  pointer: '/data/attributes/insert_size',
                },
              },
            ],
          },
        },
        relationships: {
          tag: {
            data: null,
          },
        },
      },
      {
        id: '32186',
        type: 'aliquots',
        attributes: {
          aliquot_type: 'derived',
          source_id: 13462,
          source_type: 'Pacbio::Library',
          used_by_id: 6554,
          used_by_type: 'Pacbio::Well',
          state: 'created',
          volume: 6.0,
          concentration: 9.7,
          insert_size: null,
          template_prep_kit_box_barcode: '035628102141700123124',
          tag_id: null,
          run_suitability: {
            ready_for_run: false,
            errors: [
              {
                title: "can't be blank",
                detail: "insert_size - can't be blank",
                code: '100',
                source: {
                  pointer: '/data/attributes/insert_size',
                },
              },
            ],
          },
        },
        relationships: {
          tag: {
            data: null,
          },
        },
      },
      {
        id: '32187',
        type: 'aliquots',
        attributes: {
          aliquot_type: 'derived',
          source_id: 13357,
          source_type: 'Pacbio::Library',
          used_by_id: 6555,
          used_by_type: 'Pacbio::Well',
          state: 'created',
          volume: 40.0,
          concentration: 1.17,
          insert_size: null,
          template_prep_kit_box_barcode: '035628102141700123124',
          tag_id: null,
          run_suitability: {
            ready_for_run: false,
            errors: [
              {
                title: "can't be blank",
                detail: "insert_size - can't be blank",
                code: '100',
                source: {
                  pointer: '/data/attributes/insert_size',
                },
              },
            ],
          },
        },
        relationships: {
          tag: {
            data: null,
          },
        },
      },
      {
        id: '13462',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13462',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 33.5,
          concentration: 9.7,
          template_prep_kit_box_barcode: '035628102141700123124',
          insert_size: 7500,
          created_at: '2024/09/04 14:10',
          deactivated_at: null,
          source_identifier: 'SQPP-55228-R:A1',
          pacbio_request_id: 7896,
          tag_id: 585,
          used_volume: 6.0,
          available_volume: 27.5,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13462/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13462/request',
            },
            data: {
              type: 'requests',
              id: '7896',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13462/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13462/tag',
            },
            data: {
              type: 'tags',
              id: '585',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13462/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13462/tube',
            },
            data: {
              type: 'tubes',
              id: '10748',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13462/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13462/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13462/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13462/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13462/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13462/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '31774',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13462/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13462/used_aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '31775',
              },
            ],
          },
        },
      },
      {
        id: '13357',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13357',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 161.5,
          concentration: 1.17,
          template_prep_kit_box_barcode: '035628102141700123124',
          insert_size: 4400,
          created_at: '2024/08/20 13:56',
          deactivated_at: null,
          source_identifier: '3981839499760',
          pacbio_request_id: 8047,
          tag_id: 0,
          used_volume: 78.0,
          available_volume: 83.5,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13357/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13357/request',
            },
            data: {
              type: 'requests',
              id: '8047',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13357/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13357/tag',
            },
            data: null,
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13357/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13357/tube',
            },
            data: {
              type: 'tubes',
              id: '10483',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13357/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13357/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13357/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13357/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13357/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13357/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '31443',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13357/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13357/used_aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '30988',
              },
            ],
          },
        },
      },
      {
        id: '12739',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/12739',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 11.0,
          concentration: 10.5,
          template_prep_kit_box_barcode: '035092100938900103124',
          insert_size: 8788,
          created_at: '2024/07/01 14:27',
          deactivated_at: null,
          source_identifier: 'SQPP-53631-Q:H1',
          pacbio_request_id: 7236,
          tag_id: 607,
          used_volume: 7.0,
          available_volume: 4.0,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/12739/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/12739/request',
            },
            data: {
              type: 'requests',
              id: '7236',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/12739/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/12739/tag',
            },
            data: {
              type: 'tags',
              id: '607',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/12739/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/12739/tube',
            },
            data: {
              type: 'tubes',
              id: '9452',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/12739/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/12739/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/12739/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/12739/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/12739/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/12739/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '27999',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/12739/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/12739/used_aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '28000',
              },
            ],
          },
        },
      },
      {
        id: '13413',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13413',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 30.8,
          concentration: 9.2,
          template_prep_kit_box_barcode: '034451102141700063024',
          insert_size: 7079,
          created_at: '2024/08/30 07:42',
          deactivated_at: null,
          source_identifier: 'SQPP-61376-R:C1',
          pacbio_request_id: 8513,
          tag_id: 603,
          used_volume: 3.0,
          available_volume: 27.8,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13413/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13413/request',
            },
            data: {
              type: 'requests',
              id: '8513',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13413/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13413/tag',
            },
            data: {
              type: 'tags',
              id: '603',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13413/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13413/tube',
            },
            data: {
              type: 'tubes',
              id: '10621',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13413/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13413/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13413/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13413/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13413/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13413/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '31452',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13413/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13413/used_aliquots',
            },
          },
        },
      },
      {
        id: '13412',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13412',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 21.3,
          concentration: 14.37,
          template_prep_kit_box_barcode: '034451102141700063024',
          insert_size: 11000,
          created_at: '2024/08/30 07:41',
          deactivated_at: null,
          source_identifier: 'SQPP-61376-R:B1',
          pacbio_request_id: 8512,
          tag_id: 602,
          used_volume: 3.0,
          available_volume: 18.3,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13412/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13412/request',
            },
            data: {
              type: 'requests',
              id: '8512',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13412/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13412/tag',
            },
            data: {
              type: 'tags',
              id: '602',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13412/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13412/tube',
            },
            data: {
              type: 'tubes',
              id: '10620',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13412/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13412/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13412/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13412/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13412/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13412/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '31450',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13412/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13412/used_aliquots',
            },
          },
        },
      },
      {
        id: '13411',
        type: 'libraries',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13411',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          state: 'pending',
          volume: 21.5,
          concentration: 13.05,
          template_prep_kit_box_barcode: '034451102141700063024',
          insert_size: 10000,
          created_at: '2024/08/30 07:40',
          deactivated_at: null,
          source_identifier: 'SQPP-61376-R:A1',
          pacbio_request_id: 8511,
          tag_id: 601,
          used_volume: 3.0,
          available_volume: 18.5,
        },
        relationships: {
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13411/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13411/request',
            },
            data: {
              type: 'requests',
              id: '8511',
            },
          },
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13411/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13411/tag',
            },
            data: {
              type: 'tags',
              id: '601',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13411/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13411/tube',
            },
            data: {
              type: 'tubes',
              id: '10619',
            },
          },
          source_well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13411/relationships/source_well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13411/source_well',
            },
          },
          source_plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13411/relationships/source_plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13411/source_plate',
            },
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13411/relationships/primary_aliquot',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13411/primary_aliquot',
            },
            data: {
              type: 'aliquots',
              id: '31448',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13411/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/libraries/13411/used_aliquots',
            },
          },
        },
      },
      {
        id: '9452',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/9452',
        },
        attributes: {
          barcode: 'TRAC-2-9452',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/9452/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/9452/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/9452/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/9452/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/9452/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/9452/libraries',
            },
            data: {
              type: 'libraries',
              id: '12739',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/9452/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/9452/requests',
            },
          },
        },
      },
      {
        id: '10483',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10483',
        },
        attributes: {
          barcode: 'TRAC-2-10483',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10483/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10483/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10483/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10483/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10483/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10483/libraries',
            },
            data: {
              type: 'libraries',
              id: '13357',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10483/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10483/requests',
            },
          },
        },
      },
      {
        id: '10748',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10748',
        },
        attributes: {
          barcode: 'TRAC-2-10748',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10748/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10748/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10748/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10748/pools',
            },
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10748/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10748/libraries',
            },
            data: {
              type: 'libraries',
              id: '13462',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10748/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10748/requests',
            },
          },
        },
      },
      {
        id: '10797',
        type: 'tubes',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10797',
        },
        attributes: {
          barcode: 'TRAC-2-10797',
        },
        relationships: {
          materials: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10797/relationships/materials',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10797/materials',
            },
          },
          pools: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10797/relationships/pools',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10797/pools',
            },
            data: [
              {
                type: 'pools',
                id: '5817',
              },
            ],
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10797/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10797/libraries',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10797/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/tubes/10797/requests',
            },
          },
        },
      },
      {
        id: '8047',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8047',
        },
        attributes: {
          library_type: 'Pacbio_HiFi',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S10414',
          external_study_id: '26c33714-3b72-11ee-9ce6-fa163eea3084',
          sample_name: 'B2AR_DMS15021048',
          barcode: '3981839499760',
          sample_species: 'Homo sapiens',
          created_at: '2024/07/26 12:28',
          source_identifier: '3981839499760',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8047/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8047/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8047/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8047/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8047/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8047/tube',
            },
          },
        },
      },
      {
        id: '7896',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/7896',
        },
        attributes: {
          library_type: 'PacBio_Ultra_Low_Input',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S10010',
          external_study_id: '8d58238e-a2b5-11eb-84d2-fa163eac3af7',
          sample_name: 'TOL_ASG14834723',
          barcode: null,
          sample_species: 'Aplysina cauliformis',
          created_at: '2024/07/19 10:13',
          source_identifier: 'SQPP-55228-R:A1',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/7896/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/7896/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/7896/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/7896/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/7896/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/7896/tube',
            },
          },
        },
      },
      {
        id: '7236',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/7236',
        },
        attributes: {
          library_type: 'PacBio_Ultra_Low_Input',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S4699',
          external_study_id: 'cf04ea86-ac82-11e9-8998-68b599768938',
          sample_name: 'DTOL14801229',
          barcode: null,
          sample_species: 'Rhyzobius forestieri',
          created_at: '2024/06/05 09:08',
          source_identifier: 'SQPP-53631-Q:H1',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/7236/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/7236/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/7236/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/7236/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/7236/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/7236/tube',
            },
          },
        },
      },
      {
        id: '8511',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8511',
        },
        attributes: {
          library_type: 'Pacbio_HiFi_mplx',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S10967',
          external_study_id: '3347529a-5bbf-11ef-88d5-024293460e78',
          sample_name: 'PacGUK115071526',
          barcode: null,
          sample_species: 'Saccharomyces cerevisiae S288C',
          created_at: '2024/08/23 10:40',
          source_identifier: 'SQPP-61376-R:A1',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8511/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8511/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8511/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8511/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8511/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8511/tube',
            },
          },
        },
      },
      {
        id: '8512',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8512',
        },
        attributes: {
          library_type: 'Pacbio_HiFi_mplx',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S10967',
          external_study_id: '3347529a-5bbf-11ef-88d5-024293460e78',
          sample_name: 'PacGUK115071527',
          barcode: null,
          sample_species: 'Saccharomyces cerevisiae S288C',
          created_at: '2024/08/23 10:40',
          source_identifier: 'SQPP-61376-R:B1',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8512/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8512/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8512/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8512/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8512/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8512/tube',
            },
          },
        },
      },
      {
        id: '8513',
        type: 'requests',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8513',
        },
        attributes: {
          library_type: 'Pacbio_HiFi_mplx',
          estimate_of_gb_required: null,
          number_of_smrt_cells: null,
          cost_code: 'S10967',
          external_study_id: '3347529a-5bbf-11ef-88d5-024293460e78',
          sample_name: 'PacGUK115071528',
          barcode: null,
          sample_species: 'Saccharomyces cerevisiae S288C',
          created_at: '2024/08/23 10:40',
          source_identifier: 'SQPP-61376-R:C1',
        },
        relationships: {
          well: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8513/relationships/well',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8513/well',
            },
          },
          plate: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8513/relationships/plate',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8513/plate',
            },
          },
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8513/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/requests/8513/tube',
            },
          },
        },
      },
      {
        id: '28000',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/28000',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 7236,
          source_type: 'Pacbio::Request',
          used_by_id: 12739,
          used_by_type: 'Pacbio::Library',
          state: 'created',
          volume: 11.0,
          concentration: 10.5,
          insert_size: 8788,
          template_prep_kit_box_barcode: '035092100938900103124',
          tag_id: 607,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/28000/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/28000/tag',
            },
            data: {
              type: 'tags',
              id: '607',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/28000/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/28000/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/28000/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/28000/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/28000/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/28000/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/28000/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/28000/pool',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/28000/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/28000/library',
            },
            data: {
              type: 'libraries',
              id: '12739',
            },
          },
        },
      },
      {
        id: '30988',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30988',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 8047,
          source_type: 'Pacbio::Request',
          used_by_id: 13357,
          used_by_type: 'Pacbio::Library',
          state: 'created',
          volume: 161.5,
          concentration: 1.17,
          insert_size: 4400,
          template_prep_kit_box_barcode: '035628102141700123124',
          tag_id: null,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30988/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30988/tag',
            },
            data: null,
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30988/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30988/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30988/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30988/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30988/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30988/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30988/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30988/pool',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30988/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/30988/library',
            },
            data: {
              type: 'libraries',
              id: '13357',
            },
          },
        },
      },
      {
        id: '31775',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31775',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 7896,
          source_type: 'Pacbio::Request',
          used_by_id: 13462,
          used_by_type: 'Pacbio::Library',
          state: 'created',
          volume: 33.5,
          concentration: 9.7,
          insert_size: 7500,
          template_prep_kit_box_barcode: '035628102141700123124',
          tag_id: 585,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31775/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31775/tag',
            },
            data: {
              type: 'tags',
              id: '585',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31775/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31775/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31775/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31775/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31775/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31775/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31775/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31775/pool',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31775/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31775/library',
            },
            data: {
              type: 'libraries',
              id: '13462',
            },
          },
        },
      },
      {
        id: '31984',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31984',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 13411,
          source_type: 'Pacbio::Library',
          used_by_id: 5817,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 3.0,
          concentration: 13.05,
          insert_size: 10000,
          template_prep_kit_box_barcode: '034451102141700063024',
          tag_id: 601,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31984/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31984/tag',
            },
            data: {
              type: 'tags',
              id: '601',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31984/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31984/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31984/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31984/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31984/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31984/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31984/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31984/pool',
            },
            data: {
              type: 'pools',
              id: '5817',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31984/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31984/library',
            },
          },
        },
      },
      {
        id: '31985',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31985',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 13412,
          source_type: 'Pacbio::Library',
          used_by_id: 5817,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 3.0,
          concentration: 14.37,
          insert_size: 11000,
          template_prep_kit_box_barcode: '034451102141700063024',
          tag_id: 602,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31985/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31985/tag',
            },
            data: {
              type: 'tags',
              id: '602',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31985/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31985/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31985/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31985/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31985/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31985/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31985/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31985/pool',
            },
            data: {
              type: 'pools',
              id: '5817',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31985/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31985/library',
            },
          },
        },
      },
      {
        id: '31986',
        type: 'aliquots',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31986',
        },
        attributes: {
          aliquot_type: 'derived',
          source_id: 13413,
          source_type: 'Pacbio::Library',
          used_by_id: 5817,
          used_by_type: 'Pacbio::Pool',
          state: 'created',
          volume: 3.0,
          concentration: 9.2,
          insert_size: 7079,
          template_prep_kit_box_barcode: '034451102141700063024',
          tag_id: 603,
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
        },
        relationships: {
          tag: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31986/relationships/tag',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31986/tag',
            },
            data: {
              type: 'tags',
              id: '603',
            },
          },
          source: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31986/relationships/source',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31986/source',
            },
          },
          used_by: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31986/relationships/used_by',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31986/used_by',
            },
          },
          request: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31986/relationships/request',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31986/request',
            },
          },
          pool: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31986/relationships/pool',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31986/pool',
            },
            data: {
              type: 'pools',
              id: '5817',
            },
          },
          library: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31986/relationships/library',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/aliquots/31986/library',
            },
          },
        },
      },
      {
        id: '585',
        type: 'tags',
        attributes: {
          oligo: 'TGAGCTATGCGAGTAT',
          group_id: 'bc2065',
        },
      },
      {
        id: '607',
        type: 'tags',
        attributes: {
          oligo: 'TCGCTGTCACGAGTAT',
          group_id: 'bc2087',
        },
      },
      {
        id: '601',
        type: 'tags',
        attributes: {
          oligo: 'CTACTATGTCGAGTAT',
          group_id: 'bc2081',
        },
      },
      {
        id: '602',
        type: 'tags',
        attributes: {
          oligo: 'ATGTACAGACGAGTAT',
          group_id: 'bc2082',
        },
      },
      {
        id: '603',
        type: 'tags',
        attributes: {
          oligo: 'ACTCATCAGTGAGTAT',
          group_id: 'bc2083',
        },
      },
      {
        id: '5817',
        type: 'pools',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/5817',
        },
        attributes: {
          run_suitability: {
            ready_for_run: true,
            errors: [],
          },
          volume: 9.0,
          concentration: 12.21,
          template_prep_kit_box_barcode: '034451102141700063024',
          insert_size: 9360,
          created_at: '2024/09/09 14:03',
          updated_at: '2024/09/09 14:03',
          used_volume: 9.0,
          available_volume: 0.0,
          source_identifier: 'TRAC-2-10619,TRAC-2-10620,TRAC-2-10621',
        },
        relationships: {
          tube: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/5817/relationships/tube',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/5817/tube',
            },
            data: {
              type: 'tubes',
              id: '10797',
            },
          },
          used_aliquots: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/5817/relationships/used_aliquots',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/5817/used_aliquots',
            },
            data: [
              {
                type: 'aliquots',
                id: '31984',
              },
              {
                type: 'aliquots',
                id: '31985',
              },
              {
                type: 'aliquots',
                id: '31986',
              },
            ],
          },
          primary_aliquot: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/5817/relationships/primary_aliquot',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/5817/primary_aliquot',
            },
          },
          requests: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/5817/relationships/requests',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/5817/requests',
            },
            data: [],
          },
          libraries: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/5817/relationships/libraries',
              related: 'https://traction.psd.sanger.ac.uk/v1/pacbio/pools/5817/libraries',
            },
            data: [
              {
                type: 'libraries',
                id: '13413',
              },
              {
                type: 'libraries',
                id: '13412',
              },
              {
                type: 'libraries',
                id: '13411',
              },
            ],
          },
        },
      },
      {
        id: '4',
        type: 'smrt_link_versions',
        links: {
          self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/smrt_link_versions/4',
        },
        attributes: {
          name: 'v13_sequel_iie',
          default: false,
          active: true,
        },
        relationships: {
          smrt_link_option_versions: {
            links: {
              self: 'https://traction.psd.sanger.ac.uk/v1/pacbio/smrt_link_versions/4/relationships/smrt_link_option_versions',
              related:
                'https://traction.psd.sanger.ac.uk/v1/pacbio/smrt_link_versions/4/smrt_link_option_versions',
            },
          },
        },
      },
    ],
    meta: {
      page_count: 1,
    },
  }

  return getData(data, findBy, count)
}

export default PacbioRunFactory
