import Vue from 'vue'

/**
 * @returns {Object} the default attributes for a run
 * id new inidcates a new record
 **/
const runAttributes = {
  id: 'new',
  system_name: 'Sequel IIe',
  sequencing_kit_box_barcode: null,
  dna_control_complex_box_barcode: null,
  comments: null,
}

/*
 * @returns {Array} of required attributes for a run
 */
const requiredAttributes = () => ['sequencing_kit_box_barcode', 'dna_control_complex_box_barcode']

/**
 * @param {attributes} - Object of attributes for an existing run
 * @returns {Object} - A Fresh Pacbio Sequencing Run.
 * If id is nil it will be marked as a new run
 */
const newRun = (attributes) => {
  return {
    ...runAttributes,
    ...attributes,
  }
}

const defaultWellAttributes = () => {
  const onInstrument = 'On Instrument'

  return {
    movie_time: null,
    ccs_analysis_output: 'Yes',
    pre_extension_time: 2,
    loading_target_p1_plus_p2: 0.85,
    generate_hifi: onInstrument,
    binding_kit_box_barcode: null,
    on_plate_loading_concentration: null,
    ccs_analysis_output_include_kinetics_information: 'Yes',
    ccs_analysis_output_include_low_quality_reads: 'No',
    demultiplex_barcodes: onInstrument,
    include_fivemc_calls_in_cpg_motifs: 'Yes',
    movie_acquisition_time: null,
    include_base_kinetics: null,
    library_concentration: null,
    polymerase_kit: null,
  }
}

const smrtLinkVersionDefaultComponents = {
  v10: [],
  v11: [
    {
      name: 'movie_time',
      component: 'traction-select',
      value: 'movie_time',
      label: 'Move Time: ',
      props: {
        options: [
          { text: 'Movie Time', value: '', disabled: true },
          '10.0',
          '15.0',
          '20.0',
          '24.0',
          '30.0',
        ],
        dataAttribute: 'default-movie-time',
      },
    },
    {
      name: 'pre-extension-time',
      component: 'traction-input',
      value: 'pre_extension_time',
      label: 'Pre-extension time:',
      props: {
        placeholder: 'Default Pre-extension time',
        dataAttribute: 'default-pre-extension-time',
      },
    },
    {
      name: 'loading_target_p1_plus_p2',
      component: 'traction-input',
      value: 'loading_target_p1_plus_p2',
      label: 'Loading Target (P1 + P2):',
      props: {
        type: 'number',
        step: 0.05,
        dataAttribute: 'default-loading-target-p1-plus-p2',
        placeholder: 'Loading Target (P1 + P2)',
      },
    },
    {
      name: 'binding_kit_box_barcode',
      component: 'traction-input',
      value: 'binding_kit_box_barcode',
      label: 'Binding Kit Box Barcode:',
      props: {
        dataAttribute: 'default-binding-kit-box-barcode',
        placeholder: 'Default Binding Kit Box Barcode for new wells',
        type: 'text',
      },
    },
    {
      name: 'ccs_analysis_output_include_kinetics_information',
      component: 'traction-select',
      value: 'ccs_analysis_output_include_kinetics_information',
      label: 'CCS Analysis Output Include Kinetics Information:',
      props: {
        options: ['Yes', 'No'],
        dataAttribute: 'default-ccs-analysis-output-include-kinetics-information',
        placeholder: 'Default CCS Analysis Output Include Kinetics Information for new wells',
      },
    },
    {
      name: 'ccs_analysis_output_include_low_quality_reads',
      component: 'traction-select',
      value: 'ccs_analysis_output_include_low_quality_reads',
      label: 'CCS Analysis Output Include Low Quality Reads:',
      props: {
        options: ['Yes', 'No'],
        dataAttribute: 'default-ccs-analysis-output-include-low-quality-reads',
        placeholder: 'Default CCS Analysis Output Include Low Quality Reads for new wells',
      },
    },
    {
      name: 'demultiplex_barcodes',
      component: 'traction-select',
      value: 'demultiplex_barcodes',
      label: 'Demultiplex barcodes:',
      props: {
        options: [
          { text: 'Please select a value', value: '', disabled: true },
          'In SMRT Link',
          'Do Not Generate',
          'On Instrument',
        ],
        dataAttribute: 'default-demultiplex-barcodes',
        placeholder: 'Default Demultiplex Barcodes for new wells',
      },
    },
    {
      name: 'include_fivemc_calls_in_cpg_motifs',
      component: 'traction-select',
      attribute: 'include_fivemc_calls_in_cpg_motifs',
      label: 'Include 5mc Calls In CpG Motifs:',
      props: {
        options: ['Yes', 'No'],
        dataAttribute: 'default-include-fivemc-calls-in-cpg-motifs',
        placeholder: 'Default Include 5mc Calls in CpG Motifs for new wells',
      },
    },
  ],
  v12_revio: [
    {
      name: 'movie_acquisition_time',
      component: 'traction-input',
      value: 'movie_acquisition_time',
      label: 'Movie Acquisition Time (hrs):',
      props: {
        type: 'number',
        step: 1,
        max: 30,
        min: 0.1,
        dataAttribute: 'default-movie-acquisition-time',
        placeholder: 'Movie Acquisition Time',
      },
    },
    {
      name: 'include_base_kinetics',
      component: 'traction-select',
      value: 'include_base_kinetics',
      label: 'Include Base Kinetics: ',
      props: {
        options: ['True', 'False'],
        dataAttribute: 'default-include-base-kinetics',
        placeholder: 'Include Base Kinetics',
      },
    },
    {
      name: 'library_concentration',
      component: 'traction-input',
      value: 'library_concentration',
      label: 'Library Concentration: ',
      props: {
        type: 'number',
        dataAttribute: 'default-library-concentration',
        placeholder: 'Library Concentration',
      },
    },
    {
      name: 'polymerase_kit',
      component: 'traction-input',
      value: 'polymerase_kit',
      label: 'Polymerase Kit ',
      props: {
        type: 'number',
        dataAttribute: 'default-polymerase-kit',
        placeholder: 'Polymerase Kit',
      },
    },
    {
      name: 'pre-extension-time',
      component: 'traction-input',
      value: 'pre_extension_time',
      label: 'Pre-extension time:',
      props: {
        placeholder: 'Default Pre-extension time',
        dataAttribute: 'default-pre-extension-time',
      },
    },
  ],
}

/**
 *
 * @param {String} position e.g. A1
 * @returns {Array} [row, column] e.g. ['A','1']
 */
const splitPosition = (position) => {
  // match() returns [original, row, column] e.g "A10 => ["A10", "A", "10"]
  return position.match(/(\S)(\d+)/).slice(1)
}

/**
 *
 * @param {String} position The position of the well e.g. A1
 * @param {Object} attributes Any other attributes
 * @returns {Object} A new well with all of the required attributes
 */
const newWell = ({ position, ...attributes }) => {
  const [row, column] = splitPosition(position)
  return {
    ...defaultWellAttributes(),
    pools: [],
    ...attributes,
    position,
    row,
    column,
  }
}

/*
 * @param {run} - A Pacbio Sequencing Run Object
 * @returns none - It modifies the original as it needs to be reactive
 * checks if requiredAttributes are completed. If not adds an error
 *
 */
const validate = ({ run }) => {
  const errors = {}
  requiredAttributes().forEach((field) => {
    if (!run[field]) errors[field] = 'must be present'
  })
  Vue.set(run, 'errors', errors)
}

/*
 * @param {run} - A Pacbio Sequencing Run Object
 * @returns {boolean}
 * A run is valid if it has no errors or errors are empty
 * A run is not valid if it has any errors
 */
const valid = ({ run }) => {
  return Object.keys(run.errors || {}).length === 0
}

/**
 * @param {id} - An Integer for the id of the run
 * @param {run} - A pacbio sequencing run object minus id
 * @param {wells} - An array of wells
 * @returns {Object} - A request payload
 * @example { data: { type: 'runs', id: 1, attributes: { system_name: 'Sequel IIe',
  sequencing_kit_box_barcode: 'ABC123',
  dna_control_complex_box_barcode: 'BCD234',
  smrt_link_version_id: 1,}, wells: [
    { ...well1}, { ...well2}
  ]}}
 **/
const createPayload = ({ id, run, wells }) => {
  return {
    data: {
      type: 'runs',
      id,
      attributes: {
        ...run,
        well_attributes: [...wells],
      },
    },
  }
}

/**
 * @returns enum for new and existing
 */
const RunTypeEnum = {
  New: Symbol('new'),
  Existing: Symbol('existing'),
}

const newRunType = {
  type: RunTypeEnum.New,
  id: 'create-run',
  theme: 'create',
  action: 'create',
  label: 'Create Run',

  // returns the payload slightly different for new and existing runs
  payload({ run, wells }) {
    // eslint-disable-next-line no-unused-vars
    const { id, ...attributes } = run
    return createPayload({ run: attributes, wells: Object.values(wells) })
  },

  // returns a promise different for create or update
  promise({ payload, request }) {
    return request.create({ data: payload })
  },
}

const existingRunType = {
  type: RunTypeEnum.Existing,
  id: 'update-run',
  theme: 'update',
  action: 'update',
  label: 'Update Run',
  payload({ run, wells }) {
    // eslint-disable-next-line no-unused-vars
    const { id, ...attributes } = run
    return createPayload({ id, run: attributes, wells: Object.values(wells) })
  },
  // the function handle should be the same for create and update
  promise({ payload, request }) {
    return request.update(payload)
  },
}

/**
 *
 * @param {Integer | String} id - id of rhe run
 * @returns {Object} - runType { type:, theme:, label:, payload: function, promise: function}
 * I have isolated the complexity for new and existing runs.
 * It is clear that new runType and existing runType are very similar. Question is how to improve?
 */
const createRunType = ({ id }) => {
  return isNaN(id) ? newRunType : existingRunType
}

export {
  newRun,
  validate,
  valid,
  defaultWellAttributes,
  newWell,
  createPayload,
  RunTypeEnum,
  createRunType,
  newRunType,
  existingRunType,
  smrtLinkVersionDefaultComponents,
}
