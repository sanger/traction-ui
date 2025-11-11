import { defaultSmrtLinkAttributes } from '@/config/PacbioRunWellSmrtLinkOptions.js'
import { payloadForAnnotations } from '@/stores/utilities/annotation.js'

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
 * Currently defaults to one plate, for a Revio run
 **/
const runAttributes = () => {
  return {
    id: 'new',
    type: 'runs',
    system_name: 'Revio',
    dna_control_complex_box_barcode: null,
    // Default adaptive loading to true
    // This is used by smrtLinkWellDefaults to set the use_adaptive_loading option
    adaptive_loading: true,
  }
}

/**
 * @returns {Object} - A Fresh Pacbio Sequencing Run.
 */
const newRun = (attributes = {}) => {
  return {
    ...runAttributes(),
    ...attributes,
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
    ...defaultSmrtLinkAttributes(),
    used_aliquots: [],
    type: 'wells',
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
    // the type should not be in the attributes.
    //might need further refactoring but this is enough for a hot fix
    const { id, ...attributes } = run

    return createPayload({
      id,
      run: attributes,
      plates,
      wells,
      smrtLinkVersion,
      instrumentType,
    })
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
  const { type, ...attributes } = run
  return {
    data: {
      type,
      id,
      attributes: {
        ...removeReadOnlyAttributes(attributes),
        pacbio_smrt_link_version_id: smrtLinkVersion.id,
        system_name: instrumentType.name,
        annotations_attributes: payloadForAnnotations(run.annotationList),
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
 * @param {wells} - An object of wells
 * @returns {Object} - A payload for the wells
 */
const createWellsPayload = (wells) => {
  // isolate the _destroy attribute from the rest of the wells
  // sorting the wells, so if the wells are added to a plate in the order e.g. B1, C1, A1,
  // they are sorted to be A1, B1, C1, to avoid the validation error - "wells must be in a valid order"
  const { _destroy, ...rest } = Object.keys(wells)
    .sort()
    .reduce((result, key) => ((result[key] = wells[key]), result), {})

  // return the wells with the used_aliquots replaced by used_aliquots_attributes
  return (
    Object.values(rest)
      .map(({ used_aliquots: used_aliquots_attributes, annotationList, ...attributes }) => {
        return {
          ...attributes,
          used_aliquots_attributes,
          annotations_attributes: payloadForAnnotations(annotationList),
        }
      })
      // add the _destroy attribute back to the wells
      .concat(_destroy || [])
      // flatten the array
      .flat()
  )
}

/**
 * @param {run} - A run object
 * @returns {Object} - A run object with read only attributes removed
 */
const removeReadOnlyAttributes = (run) => {
  // Removes read only attributes
  /* eslint-disable no-unused-vars */
  const {
    adaptive_loading,
    sequencing_kit_box_barcodes,
    barcodes_and_concentrations,
    annotationList,
    annotations,
    ...filteredRun
  } = run
  /* eslint-enable no-unused-vars */

  return filteredRun
}

export {
  newRun,
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
