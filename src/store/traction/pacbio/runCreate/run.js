import Vue from 'vue'

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

const requiredAttributes = () => ['sequencing_kit_box_barcode', 'dna_control_complex_box_barcode']

const newRun = (attributes) => {
  return {
    ...runAttributes,
    ...attributes,
  }
}

const validate = ({ run }) => {
  const errors = {}
  requiredAttributes().forEach((field) => {
    if (!run[field]) errors[field] = 'must be present'
  })
  Vue.set(run, 'errors', errors)
}

const valid = ({ run }) => {
  return Object.keys(run.errors || {}).length === 0
}

export { newRun, validate, valid }
