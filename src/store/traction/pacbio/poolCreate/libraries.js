import Vue from 'vue'

const libraryAttributes = {
  pacbio_request_id: null,
  template_prep_kit_box_barcode: null,
  tag_id: null,
  volume: null,
  concentration: null,
  fragment_size: null,
}

const newLibrary = (attributes) => {
  return {
    ...libraryAttributes,
    ...attributes,
  }
}

/**
 * This method will check each library to ensure that:
 *  * required fields are present
 *  * tags are unique
 **/
const validate = ({ libraries }) => {
  for (const [key, library] of Object.entries(libraries)) {
    const errors = {}
    Object.keys(libraryAttributes).forEach((field) => {
      if (!library[field]) {
        errors[field] = 'must be present'
      }
    })

    if (Object.entries(libraries).some(([k, e]) => e.tag_id === library.tag_id && k !== key)) {
      errors['tag_id'] = 'duplicated'
    }

    Vue.set(libraries, key, { ...library, errors })
  }
}

// a library is valid either if it has no errors or the errors are empty
const valid = ({ libraries }) => {
  return Object.values(libraries).every((library) => Object.keys(library.errors || {}).length === 0)
}

const extractLibraryAttributes = ({
  pacbio_request_id,
  template_prep_kit_box_barcode,
  tag_id,
  volume,
  concentration,
  fragment_size,
}) => {
  return {
    pacbio_request_id,
    template_prep_kit_box_barcode,
    tag_id,
    volume,
    concentration,
    fragment_size,
  }
}

/* 
  produce a json api compliant (sort of) payload
  e.g. { data: attributes: { libraries: [ library1, library2 ... ]}}
*/
const payload = ({ libraries }) => {
  return {
    data: {
      attributes: {
        libraries: Object.values(libraries).map((library) => extractLibraryAttributes(library)),
      },
    },
  }
}

export { libraryAttributes, newLibrary, validate, valid, payload }
