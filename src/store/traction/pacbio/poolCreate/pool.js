import Vue from 'vue'

const libraryAttributes = {
  pacbio_request_id: null,
  template_prep_kit_box_barcode: null,
  tag_id: null,
  volume: null,
  concentration: null,
  insert_size: null,
}

const requiredAttributes = ['pacbio_request_id', 'tag_id', 'volume', 'concentration', 'insert_size']

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
    requiredAttributes.forEach((field) => {
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
  id,
  pacbio_request_id,
  template_prep_kit_box_barcode,
  tag_id,
  volume,
  concentration,
  insert_size,
}) => {
  return {
    id,
    pacbio_request_id,
    template_prep_kit_box_barcode,
    tag_id,
    volume,
    concentration,
    insert_size,
  }
}

const extractPoolAttributes = ({
  template_prep_kit_box_barcode,
  volume,
  concentration,
  insert_size,
}) => {
  return {
    template_prep_kit_box_barcode,
    volume,
    concentration,
    insert_size,
  }
}

/*
  produce a json api compliant payload
  e.g. { data: { type: 'pools', attributes: { library_attributes: [ library1, library2 ... ], template_prep_kit_box_barcode, volume, concentration, insert_size}}}
*/
const payload = ({ libraries, pool }) => {
  return {
    data: {
      type: 'pools',
      id: pool.id,
      attributes: {
        library_attributes: Object.values(libraries).map((library) =>
          extractLibraryAttributes(library),
        ),
        ...extractPoolAttributes(pool),
      },
    },
  }
}

export { libraryAttributes, newLibrary, validate, valid, payload }
