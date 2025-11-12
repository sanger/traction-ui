import { wellToIndex, wellFor } from './wellHelpers.js'
import { barcodeNotFound } from '../utilities/helpers.js'
import { dataToObjectById } from './../../api/JsonApi.js'

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
const autoTagPlate = ({ wells, tagSets, library, selectedTagSet, libraries }) => {
  const initialWell = wellFor(wells, library.ont_request_id)
  const initialIndex = wellToIndex(initialWell)
  const tags = tagSets[selectedTagSet.id].tags
  const initialTagIndex = tags.indexOf(library.tag_id)
  const plate = initialWell.plate

  // traverse through libraries and add tags if on the same plate
  // if not return the library without a tag
  return Object.keys(libraries).reduce((result, key) => {
    const otherWell = wellFor(wells, libraries[key].ont_request_id)

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

/**
 * Finds the tube associated with a specific request ID.
 *
 * @param {Object} tubes - An object containing all tubes, where each key is a tube ID and the value is the tube object.
 * @param {string} request_id - The ID of the request to find the associated tube for.
 * @returns {Object|undefined} - The tube object that contains the specified request ID, or `undefined` if no matching tube is found.
 *
 * @description
 * This function iterates through all the tubes and checks if the first request in the `requests` array of each tube matches the given `request_id`.
 * It returns the first tube that matches the condition or `undefined` if no match is found.
 */
const tubeFor = (tubes, request_id) =>
  Object.values(tubes).find((tube) => tube.requests[0] === request_id)

/**
 * Automatically assigns tags to libraries based on their associated tubes.
 *
 * @param {Object} params - The parameters for the function.
 * @param {Object} params.tagSets - The available tag sets.
 * @param {Object} params.tubes - The collection of tubes, where each key is a tube ID and the value is the tube object.
 * @param {Object} params.selectedTagSet - The selected tag set containing tags.
 * @param {Object} params.selectedRequests - The collection of selected requests.
 * @param {Object} params.libraries - The collection of libraries to be tagged.
 * @param {Object} params.library - The current library being processed.
 * @returns {Object} - A new collection of libraries with updated tag IDs.
 *
 * @description
 * This function assigns unique tags to libraries based on their associated tubes. It:
 * - Finds the initial tube associated with the given library's request ID.
 * - Filters the selected requests to include only those associated with tubes that have a higher ID than the initial tube.
 * - Iterates through the filtered requests and assigns a new tag to each library based on its position in the filtered list.
 * - Ensures that tags wrap around using a modulo operation if the number of requests exceeds the number of available tags.
 */
const autoTagTube = ({ tagSets, tubes, selectedTagSet, selectedRequests, libraries, library }) => {
  // Find the initial tube associated with the given library's request ID
  const initialTube = tubeFor(tubes, library.ont_request_id)

  // If no initial tube is found, return an empty object
  if (!initialTube) return {}

  // Get the tags from the selected tag set and find the index of the current library's tag
  const tags = tagSets[selectedTagSet.id].tags
  const initialTagIndex = tags.indexOf(library.tag_id)

  // Filter the selected requests to include only those associated with tubes that have a higher ID than the initial tube
  return (
    Object.values(selectedRequests)
      .filter((request) => {
        const tube = tubeFor(tubes, request.id)
        return tube && parseInt(tube.id) > parseInt(initialTube.id)
      })
      // Assign new tags to the filtered requests
      .reduce((result, request, offset) => {
        const newTag = (initialTagIndex + offset + 1) % tags.length
        const library = { ...libraries[request.id], tag_id: tags[newTag] }
        return { ...result, [request.id]: library }
      }, {})
  )
}

/**
 * Builds the tag attributes for a library based on the selected tag set and tag group ID.
 *
 * @param {Object} selectedTagSet - The selected tag set containing available tags.
 * @param {String} tag - The group ID of the tag to find within the selected tag set.
 * @param {Function} error - A callback function to handle errors, typically for user feedback.
 * @returns {Object} - An object containing the `tag_id` if a matching tag is found, or an empty object if no tag is provided.
 *
 * @throws Will invoke the `error` callback if the specified tag is not found in the selected tag set.
 *
 * @description
 * This function searches for a tag within the selected tag set using the provided group ID (`tag`).
 * If a matching tag is found, it returns an object containing the `tag_id` of the matched tag.
 * If no tag is provided, it returns an empty object.
 * If the tag is not found, the `error` callback is invoked with a descriptive error message.
 *
 * Example:
 * ```javascript
 * const selectedTagSet = {
 *   tags: [
 *     { id: '1', group_id: 'NB01' },
 *     { id: '2', group_id: 'NB02' },
 *   ],
 * }
 * const tag = 'NB01'
 * const error = (message) => console.error(message)
 * const result = buildTagAttributes(selectedTagSet, tag, error)
 * console.log(result) // Output: { tag_id: '1' }
 * ```
 */
const buildTagAttributes = (selectedTagSet, tag) => {
  if (!tag) return {}
  const matchedTag = selectedTagSet.tags.find(({ group_id }) => group_id === tag)
  if (matchedTag) {
    return { tag_id: matchedTag.id }
  } else {
    return { error: `Could not find a tag named ${tag} in selected tag group` }
  }
}

/**
 * Finds the requests associated with a given plate
 * @param {String} barcode - The plate barcode to find requests for
 * @param wellName the location of the plate well
 * @param plates a list of the plate resources
 * @param wells a list of the well resources
 * @returns {Object} Request ids / errors and success state
 */
const requestsForPlate = ({ barcode, wellName, plates, wells }) => {
  const plate = Object.values(plates).find((plate) => plate.barcode == barcode)
  if (!plate) return { success: false, errors: barcodeNotFound(barcode) }
  const wellId = plate.wells.find((well_id) => wells[well_id].position == wellName)
  if (!wellId)
    return {
      success: false,
      errors: `A well named ${wellName} could not be found on ${barcode}`,
    }
  return { success: true, plate, requestIds: wells[wellId].requests }
}

/**
 * Finds the requests associated with a given tube
 * @param {String} barcode - The tube barcode to find requests for
 * @param tubes the list of tube resources from the state
 * @returns {Object} Request ids / errors and success state
 */
const requestsForTube = ({ barcode, tubes }) => {
  const tube = Object.values(tubes).find((tube) => tube.barcode == barcode)
  if (!tube) return { success: false, errors: barcodeNotFound(barcode) }
  return { success: true, tube, requestIds: tube.requests }
}

/**
 * Finds the requests associated with a given source
 * @param {Object} sourceData - Data about the source to find requests for
 * @param resources the state resources object. Provides access to current state resources
 * @returns {Object} Request ids / errors and success state
 */
const findRequestsForSource = ({
  sourceData: { barcode, wellName },
  resources: { plates, wells, tubes },
}) => {
  if (wellName) {
    return requestsForPlate({ barcode, wellName, plates, wells })
  } else {
    return requestsForTube({ barcode, tubes })
  }
}

/**
 * Populates pooling libraries by transforming the given libraries into a structured format.
 *
 * @param {Object} libraries - An object where each key is a library ID and the value is the library data.
 * @returns {Object} - A new object where each key is the `ont_request_id` (derived from the library's `request` field),
 *                     and the value is a library object with standardized attributes.
 *
 * @description
 * This function processes a collection of libraries and transforms them into a structured format suitable for pooling.
 * It:
 * - Iterates over the provided libraries.
 * - Creates a new library object for each entry using the `newLibrary` function.
 * - Maps the `request` field of each library to the `ont_request_id` field in the resulting object.
 * - Includes the `tag_id` field from the original library data.
 *
 * Example:
 * ```javascript
 * const libraries = {
 *   1: { request: 'req1', tag: 'tag1', volume: 10 },
 *   2: { request: 'req2', tag: 'tag2', volume: 15 },
 * }
 * const result = populatePoolingLibraries(libraries)
 * console.log(result)
 * // Output:
 * // {
 * //   req1: { ont_request_id: 'req1', tag_id: 'tag1', volume: 10, ...defaultAttributes },
 * //   req2: { ont_request_id: 'req2', tag_id: 'tag2', volume: 15, ...defaultAttributes },
 * // }
 * ```
 */
const populatePoolingLibraries = (libraries) => {
  return Object.values(libraries).reduce((result, library) => {
    const libraryObject = newLibrary({
      ...library,
      ont_request_id: library.request,
      tag_id: library.tag,
    })
    return { ...result, [library.request]: libraryObject }
  }, {})
}

/**
 * Helper function to store json api resource objects in the store.
 * @param {string} resource name of the resource to populate in the store
 * @param {bool} includeRelationships indicates if related resource ids should
 * be extracted and included in the resulting object.
 * @return {Function} A mutation function for populating the resource
 */
const populateById =
  (
    resource,
    { includeRelationships = false, populateResources = true } = {},
    replaceData = false,
  ) =>
  (state, data) => {
    // if resources then add to state.resources
    const result = populateResources ? state.resources : state

    // Store the current data so we dont overwrite it unless specifed to do so
    const before = replaceData ? {} : result[resource]
    result[resource] = {
      ...before,
      ...dataToObjectById({ data, includeRelationships }),
    }
  }

/**
 * Returns an array of library details for a given pool.
 *
 * @param {Object} params - The parameters object.
 * @param {Object} params.pool - The pool object, which should contain a `libraries` array of library IDs.
 * @param {Object} params.libraries - An object mapping library IDs to library objects.
 * @param {Object} params.requests - An object mapping request IDs to request objects.
 * @param {Object} params.tags - An object mapping tag IDs to tag objects.
 * @returns {Array} An array of objects, each containing:
 *   - sample_name: The sample name from the associated request.
 *   - group_id: The group ID from the associated tag (if available).
 *
 * @description
 * This function takes a pool and related resources, and returns an array of details for each library in the pool.
 * For each library, it extracts the sample name from the associated request and the group ID from the associated tag.
 * If the pool or its libraries are missing, it returns an empty array.
 *
 * @example
 * const details = setPoolDetails({ pool, libraries, requests, tags })
 * // details = [
 * //   { sample_name: 'Sample A', group_id: 'G1' },
 * //   { sample_name: 'Sample B', group_id: 'G2' }
 * // ]
 */
const createPoolDetails = ({ pool, libraries, requests, tags }) => {
  if (!pool || !pool.libraries) return []
  return pool.libraries.map((libraryId) => {
    const { request, tag } = libraries[libraryId]
    const { sample_name } = requests[request]
    const { group_id } = tags[tag] || {}
    return { sample_name, group_id }
  })
}

export {
  libraryAttributes,
  newLibrary,
  validate,
  valid,
  payload,
  autoTagPlate,
  tubeFor,
  autoTagTube,
  buildTagAttributes,
  findRequestsForSource,
  populatePoolingLibraries,
  populateById,
  createPoolDetails,
}
