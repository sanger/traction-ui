import { updatePacbioLibraryResource } from '@/services/traction/PacbioLibrary.js'

/**
 * @function validateFields
 * @param {Object} library - The library object to validate.
 * @returns {boolean} Returns true if all required fields are present and truthy in the library object, false otherwise.
 * @description Validates that the required fields are present in the given library object.
 * The required fields are 'id', 'template_prep_kit_box_barcode', 'volume' and 'concentration'.
 * The 'tag' and 'insert_size' fields are optional.
 */
const validateLibraryFields = (library) => {
  const requiredAttributes = [
    'id',
    'template_prep_kit_box_barcode',
    'volume',
    'concentration',
    'insert_size',
  ]
  const errors = requiredAttributes.filter(
    (field) => library[field] === null || library[field] === '',
  )

  return {
    success: errors.length === 0,
    errors: errors.length ? 'Missing required field(s)' : '',
  }
}

/**
 * Formats and transforms libraries.
 *
 * @param {Object} libraries - The libraries to format and transform.
 * @param {Object} tags - The tags associated with the libraries.
 * @param {Object} requests - The requests associated with the libraries.
 * @returns {Array<Object>} - The formatted and transformed libraries.
 */
const formatAndTransformLibraries = (libraries, tags, requests) =>
  Object.values(libraries).map((library) => {
    const { id, request, tag_id, tag, ...attributes } = library
    // TODO: Look into the below tag lines and see if they can be simplified
    const tagId = tag_id ?? tag
    const tagGroupId = tags[tagId] ? (tags[tagId].group_id ?? '') : ''
    return {
      id,
      tag_id: String(tagId),
      ...attributes,
      tag_group_id: tagGroupId,
      sample_name: requests[request]?.sample_name,
    }
  })

/**
 * Exhausts the volume of a library.
 *
 * @param {Object} library - The library to exhaust the volume of.
 * @returns {Promise<Object>} - An object containing the success status and any errors.
 */
async function exhaustLibrayVolume(library) {
  library.volume = library.used_volume
  const { success, errors } = await validateAndUpdateLibrary(library)
  return { success, errors }
}

/**
 * Checks if the library is exhausted.
 *
 * @param {Object} library - The library object to check.
 * @param {number} library.volume - The current volume of the library.
 * @param {number} library.used_volume - The used volume of the library.
 * @returns {boolean} - Returns true if the library is exhausted, otherwise false.
 */
const isLibraryExhausted = (library) => library.volume === library.used_volume

/**
 * Updates a library with the given fields and updates the store if successful.
 *
 * @param {Object} libraryFields - The fields of the library to update.
 * @returns {Object} - An object with the success status, errors, and updated Library.
 */
async function validateAndUpdateLibrary(libraryFields) {
  //Validate the libraryFields to ensure that all required fields are present
  const valid = validateLibraryFields(libraryFields)
  if (!valid.success) {
    return valid
  }
  const { success, errors, updatedLibrary } = await updatePacbioLibraryResource(libraryFields)
  return { success, errors, updatedLibrary }
}

export {
  validateAndUpdateLibrary,
  exhaustLibrayVolume,
  formatAndTransformLibraries,
  isLibraryExhausted,
}
