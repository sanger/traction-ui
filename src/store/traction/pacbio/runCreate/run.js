/**
 *
 * @param {String} plateNumber The number of the plate e.g. 1
 * @returns {Object} A new plate
 */
const newPlate = (plateNumber) => {
  return {
    plate_number: plateNumber,
    sequencing_kit_box_barcode: '',
  }
}

/**
 * @returns {Object} the default attributes for a run
 * id 'new' inidcates a new record
 * Currently defaults to one plate, for a Sequel IIe run
 **/
const runAttributes = () => {
  return {
    id: 'new',
    system_name: 'Sequel IIe',
    dna_control_complex_box_barcode: null,
    comments: null,
  }
}

/**
 * @returns {Object} - A Fresh Pacbio Sequencing Run.
 */
const newRun = () => {
  return {
    ...runAttributes(),
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
  payload({ run, plates, wells, smrtLinkVersion, instrumentType }) {
    // eslint-disable-next-line no-unused-vars
    const { id, ...attributes } = run

    return createPayload({ run: attributes, plates, wells, smrtLinkVersion, instrumentType })
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
  payload({ run, plates, wells, smrtLinkVersion, instrumentType }) {
    // eslint-disable-next-line no-unused-vars
    const { id, ...attributes } = run

    return createPayload({ id, run: attributes, plates, wells, smrtLinkVersion, instrumentType })
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

/**
 * @param {id} - An Integer for the id of the run
 * @param {run} - A pacbio sequencing run object minus id
 * @param {plates} - An object of plates
 * @param {wells} - An object of wells
 * @param {smrtLinkVersion} - The SMRT Link Version of the run
 * @param {instrumentType} - The instrument type of the run
 * @returns {Object} - A payload for the run
 * creates a JSONAPI payload for a run
 */
const createPayload = ({ id, run, plates, wells, smrtLinkVersion, instrumentType }) => {
  return {
    data: {
      type: 'runs',
      id,
      attributes: {
        ...createRunPayload(run, smrtLinkVersion),
        pacbio_smrt_link_version_id: smrtLinkVersion.id,
        system_name: instrumentType.name,
        plates_attributes: Object.values(plates)
          .map(({ plate_number, ...plate }) => {
            return {
              plate_number,
              ...plate,
              wells_attributes: createWellsPayload(wells[plate_number]),
            }
          })
          .filter((plate) => hasPlateAttributes(plate)),
      },
    },
  }
}

/**
 * @param {plate} - A plate object
 * @returns {Boolean} - True if the plate is empty
 * A plate has attributes if it has a sequencing_kit_box_barcode and some wells_attributes
 */
const hasPlateAttributes = ({ sequencing_kit_box_barcode, wells_attributes }) => {
  return sequencing_kit_box_barcode || wells_attributes.length > 0
}

/**
 * @param {run} - A run object
 * @param {smrtLinkVersion} - The SMRT Link Version of the run
 * @returns {run} - A run object
 */
const SMRT_LINK_VERSION_V12_SEQUEL_IIE = 'v12_sequel_iie'

const createRunPayload = (run, smrtLinkVersion) => {
  // If the run is v12 Sequel IIe, remove redundant dna_control_complex_box_barcode
  // dna_control_complex_box_barcode is currently an optional field in the service
  // as it is not required for v12 Sequel IIe, but it for the other versions
  if (smrtLinkVersion.name == SMRT_LINK_VERSION_V12_SEQUEL_IIE) {
    run.dna_control_complex_box_barcode = null
  }
  return run
}

/**
 * @param {wells} - An object of wells
 * @returns {Object} - A payload for the wells
 */
const createWellsPayload = (wells) => {
  // isolate the _destroy attribute from the rest of the wells
  const { _destroy, ...rest } = wells

  // return the wells with the pools replaced by pool_ids attribute
  return (
    Object.values(rest)
      .map(({ pools: pool_ids, ...attributes }) => {
        return { ...attributes, pool_ids }
      })
      // add the _destroy attribute back to the wells
      .concat(_destroy || [])
      // flatten the array
      .flat()
  )
}

export {
  newRun,
  defaultWellAttributes,
  newWell,
  newPlate,
  RunTypeEnum,
  createRunType,
  newRunType,
  existingRunType,
  createPayload,
  hasPlateAttributes,
  createWellsPayload,
}
