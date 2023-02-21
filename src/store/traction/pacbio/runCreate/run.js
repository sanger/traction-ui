import Vue from 'vue'

/*
 * Returns the default attributes for a run
 * id new inidcates a new record
 */
const runAttributes = {
  id: 'new',
  system_name: 'Sequel IIe',
  sequencing_kit_box_barcode: null,
  dna_control_complex_box_barcode: null,
  comments: null,
  smrt_link_version_id: null,
  plate: {
    wells: [],
  },
}

/*
 * @returns Array of required attributes for a run
 */
const requiredAttributes = () => ['sequencing_kit_box_barcode', 'dna_control_complex_box_barcode']

/*
 * @param Object - attributes. These will be for an existing run
 * @returns Object - A Fresh Pacbio Sequencing Run.
 * If id is nil it will be marked as a new run
 */
const newRun = (attributes) => {
  return {
    ...runAttributes,
    ...attributes,
  }
}

/*
 * @param Object - A Pacbio Sequencing Run
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
 * @param Object - A Pacbio Sequencing Run
 * @returns boolean
 * A run is valid if it has no errors or errors are empty
 * A run is not valid if it has any errors
 */
const valid = ({ run }) => {
  return Object.keys(run.errors || {}).length === 0
}

export { newRun, validate, valid }
