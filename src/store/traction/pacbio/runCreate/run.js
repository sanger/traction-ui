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
  smrt_link_version_id: null,
}

/*
 * @returns {Array} of required attributes for a run
 */
const requiredAttributes = () => ['sequencing_kit_box_barcode', 'dna_control_complex_box_barcode']

/*
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
  }
}

const newWell = (attributes) => {
  return {
    ...defaultWellAttributes(),
    ...attributes,
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
        wells_attributes: [...wells],
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

/**
 *
 * @param {Integer | String} id - id of rhe run
 * @returns {Object} - runType { type:, theme:, label:, payload: function, promise: function}
 * I have isolated the complexity for new and existing runs.
 */
const createRunType = ({ id }) => {
  if (isNaN(id)) {
    return {
      type: RunTypeEnum.New,
      theme: 'create',
      label: 'Create',

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
  } else {
    return {
      type: RunTypeEnum.Existing,
      theme: 'update',
      label: 'Update',
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
  }
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
}
