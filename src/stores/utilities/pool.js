const libraryAttributes = {
  pacbio_request_id: null,
  template_prep_kit_box_barcode: null,
  tag_id: null,
  volume: null,
  concentration: null,
  insert_size: null,
}

/**
 * This function takes a boolean `isPool` and returns an array of required attributes.
 * The returned array always includes 'pacbio_request_id', 'volume', 'concentration', and 'insert_size'.
 * If `isPool` is true, the array also includes 'tag_id'.
 *
 * @param {boolean} isPool - A boolean indicating whether the attributes are for a pool.
 * @returns {string[]} The array of required attributes.
 */
const requiredAttributes = (isPool) => [
  'pacbio_request_id',
  'volume',
  'concentration',
  'insert_size',
  ...(isPool ? ['tag_id'] : []),
]

/**
 * This function takes an `attributes` object and returns a new library object.
 * It spreads the `libraryAttributes` and the `attributes` into a new object, with the `attributes` overwriting any matching properties in `libraryAttributes`.
 *
 * @param {Object} attributes - The attributes for the new library.
 * @returns {Object} The new library object with the `libraryAttributes` and the `attributes`.
 */
const newLibrary = (attributes) => {
  return {
    ...libraryAttributes,
    ...attributes,
  }
}

/**
 * Validates a set of libraries.
 * Checks if all required attributes are present in each library and if there are no duplicate tags.
 * If a library is missing a required attribute or there are duplicate tags, it adds an error message to the library.
 * These error messages is accessed in components through the 'errors' property of each library.
 * The function returns true if all libraries are valid and there are no duplicate tags, false otherwise.
 *
 * @param {Object} libraries - The libraries to validate. Each key is a library id and each value is a library object.
 * @returns {boolean} Returns true if all libraries are valid and there are no duplicate tags, false otherwise.
 *
 * @example
 * const libraries = {
 *   '1': { tag_id: 'tag1', volume: 10, concentration: 5, insert_size: 1000,pacbio_request_id:'1' },
 *   '2': { tag_id: 'tag2', volume: 10, concentration: 5, insert_size: 1000,pacbio_request_id:'1'},
 * };
 * const isValid = validate(libraries); // returns true
 */
const validate = (libraries) => {
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
  return Object.values(libraries).every((library) => Object.keys(library.errors || {}).length === 0)
}

/**
 * Extracts specific attributes from a library object.
 * @param {Object} library - The library object to extract attributes from.
 * @returns {Object} An object containing the extracted attributes.
 */
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

/**
 * Extracts specific attributes from a pool object.
 * @param {Object} pool - The pool object to extract attributes from.
 * @returns {Object} An object containing the extracted attributes.
 */
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

/**
 * Produce a json api compliant payload
 *
 * @param {Object}
 *
 * @example
 * { data: { type: 'pools', attributes: { library_attributes: [ library1, library2 ... ], template_prep_kit_box_barcode, volume, concentration, insert_size}}}
 */
const payload = ({ libraries, pool }) => {
  return {
    data: {
      type: 'pools',
      id: pool.id,
      attributes: {
        used_aliquot_attributes: Object.values(libraries).map((library) =>
          extractLibraryAttributes(library),
        ),
        ...extractPoolAttributes(pool),
      },
    },
  }
}

export { libraryAttributes, newLibrary, validate, payload }
