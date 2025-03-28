import { wellToIndex, wellFor } from '@/stores/utilities/wellHelpers.js'
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

/**
 * Automatically assigns tags to libraries based on their positions on a plate.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Object} params.wells - The wells data.
 * @param {Object} params.requests - The requests data.
 * @param {Object} params.tagSets - The available tag sets.
 * @param {Object} params.library - The current library being processed.
 * @param {Object} params.selectedTagSet - The selected tag set containing tags.
 * @param {Object} params.libraries - The collection of libraries to be tagged.
 * @returns {Object} - A new collection of libraries with updated tag IDs.
 *
 * @description
 * This function assigns unique tags to libraries on the same plate based on their
 * relative positions. It calculates the offset of each library's well index from
 * the initial library's well index and assigns a tag from the selected tag set
 * using a modulo operation to ensure tags wrap around if necessary.
 * The tags are only assigned to libraries on the same plate as the initial library.
 * - Tags are only assigned to libraries on the same plate as the initial library.
 * - Libraries with a negative or zero offset are skipped.
 */
const autoTagPlate = ({ wells, requests, tagSets, library, selectedTagSet, libraries }) => {
  const wellRequestObject = { wells, requests }
  const initialWell = wellFor(wellRequestObject, library.ont_request_id)
  const initialIndex = wellToIndex(initialWell)
  const tags = tagSets[selectedTagSet.id].tags
  const initialTagIndex = tags.indexOf(library.tag_id)
  const plate = initialWell.plate

  return Object.keys(libraries).reduce((result, key) => {
    const otherWell = wellFor(wellRequestObject, libraries[key].ont_request_id)

    // Skip if the library is not on the same plate
    if (otherWell?.plate !== plate) {
      result[key] = { ...libraries[key] }
      return result
    }

    // Calculate the offset of the library's well index from the initial library's well index
    const offset = wellToIndex(otherWell) - initialIndex

    // Skip if the offset is negative or zero
    if (offset < 1) result[key] = { ...libraries[key] }
    else {
      // Assign a new tag to the library based on the offset
      const newTag = (initialTagIndex + offset) % tags.length
      result[key] = { ...libraries[key], tag_id: tags[newTag] }
    }
    return result
  }, {})
}

export { libraryAttributes, newLibrary, validate, valid, payload, autoTagPlate }
