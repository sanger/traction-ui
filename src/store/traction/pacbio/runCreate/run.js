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
// TODO DPl-746: do attributes ever get passed in??
// TODO DPl-746: not sure here is the best place to init wells
// (required for getters getWell from PacbioRunWellItem storeWell)
// maybe move to original state
const newRun = (attributes) => {
  return {
    ...runAttributes,
    ...attributes,
    plates: [{ wells: {} }],
  }
}

// TODO DPl-746 refactor to newPlate

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
    movie_acquisition_time: '24.0',
    include_base_kinetics: 'False',
    library_concentration: null,
    polymerase_kit: null,
  }
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

const buildWellAttributes = (well) => {
  well.pool_ids = well.pools
  return well
}

// TODO DPl-746 update to real plate_number and move SKBB
const buildPlateAttributes = (plate, plateIndex) => {
  const plateId = plate.id || ''
  const wells = Object.values(plate.wells)
  const wells_attributes = wells.map((well) => {
    return buildWellAttributes(well)
  })

  return {
    id: plateId,
    plate_number: plateIndex,
    sequencing_kit_box_barcode:
      plate.sequencing_kit_box_barcode || 'REMOVE ONCE IMPLEMENTED PLATE SKBB',
    wells_attributes: [...wells_attributes],
  }
}

/**
 * @param {id} - An Integer for the id of the run
 * @param {run} - A pacbio sequencing run object minus id
 * @param {plates} - An array of plates
 * @returns {Object} - A request payload
 * @example { data: { type: 'runs', id: 1, attributes: { system_name: 'Sequel IIe',
  sequencing_kit_box_barcode: 'ABC123',
  dna_control_complex_box_barcode: 'BCD234',
  smrt_link_version_id: 1,}, plates: [ { wells: [
    { ...well1}, { ...well2}
  ]}]}}
 **/
const createRunPayload = ({ id, run, plates, smrtLinkVersion }) => {
  const platesAttributes = plates.map((plate, plateIndex) => {
    return buildPlateAttributes(plate, plateIndex)
  })

  // TODO DPL-746
  // Remove skbb from run attributes
  // As this will eventually be moved to plate attributes
  delete run.sequencing_kit_box_barcode

  return {
    data: {
      type: 'runs',
      id,
      attributes: {
        ...run,
        pacbio_smrt_link_version_id: smrtLinkVersion.id,
        plates_attributes: platesAttributes,
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
  payload({ run, smrtLinkVersion }) {
    // eslint-disable-next-line no-unused-vars
    const { id, ...attributes } = run
    const plates = attributes.plates
    delete attributes.plates

    return createRunPayload({ run: attributes, plates: plates, smrtLinkVersion })
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
  payload({ run, smrtLinkVersion }) {
    // eslint-disable-next-line no-unused-vars
    const { id, ...attributes } = run
    const plates = attributes.plates
    delete attributes.plates
    return createRunPayload({ id, run: attributes, plates: plates, smrtLinkVersion })
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
  createRunPayload,
  RunTypeEnum,
  createRunType,
  newRunType,
  existingRunType,
  buildPlateAttributes,
}
