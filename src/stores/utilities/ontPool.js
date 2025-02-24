const libraryAttributes = {
  ont_request_id: null,
  kit_barcode: null,
  tag_id: null,
  volume: null,
  concentration: null,
  insert_size: null,
}

const requiredAttributes = (isPool) => [
  'ont_request_id',
  'volume',
  'concentration',
  'insert_size',
  ...(isPool ? ['tag_id'] : []),
]

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
  const pooled = Object.keys(libraries).length > 1

  for (const [key, library] of Object.entries(libraries)) {
    const errors = {}
    requiredAttributes(pooled).forEach((field) => {
      if (!library[field]) errors[field] = 'must be present'
    })

    if (Object.entries(libraries).some(([k, e]) => e.tag_id === library.tag_id && k !== key)) {
      errors['tag_id'] = 'duplicated'
    }
    library['errors'] = errors
  }
}

// a library is valid either if it has no errors or the errors are empty
const valid = ({ libraries }) => {
  return Object.values(libraries).every((library) => Object.keys(library.errors || {}).length === 0)
}

const extractLibraryAttributes = ({
  id,
  ont_request_id,
  kit_barcode,
  tag_id,
  volume,
  concentration,
  insert_size,
}) => {
  return {
    id,
    ont_request_id,
    kit_barcode,
    tag_id,
    volume,
    concentration,
    insert_size,
  }
}

const extractPoolAttributes = ({ kit_barcode, volume, concentration, insert_size }) => {
  return {
    kit_barcode,
    volume,
    concentration,
    insert_size,
  }
}

/*
    produce a json api compliant payload
    e.g. { data: { type: 'pools', attributes: { library_attributes: [ library1, library2 ... ], kit_barcode, volume, concentration, insert_size}}}
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
