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

export { newRun, validate, valid, defaultWellAttributes, newWell, createPayload }
