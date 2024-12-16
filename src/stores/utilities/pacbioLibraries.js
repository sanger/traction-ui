import useRootStore from '@/stores'
import { handleResponse } from '@/api/v2/ResponseHelper.js'
import { groupIncludedByResource, dataToObjectById } from '@/api/JsonApi.js'

/**
 *
 * @param {Integer | String} id - id of the library
 * @param {Integer | String} pacbio_request_id - id of the pacbio request
 * @param {String} template_prep_kit_box_barcode - barcode of the template prep kit box
 * @param {Integer | String} tag_id - id of the tag
 * @param {Float} concentration - concentration of the library
 * @param {Float} volume - volume of the library
 * @param {Float} insert_size - insert size of the library
 * @returns {Object} - payload for creating a library
 * if it is an update id is added otherwise pacbio_request_id is added
 *
 */
const libraryPayload = ({
  id,
  pacbio_request_id,
  template_prep_kit_box_barcode,
  tag_id,
  concentration,
  volume,
  insert_size,
}) => {
  const requiredAttributes = {
    template_prep_kit_box_barcode,
    tag_id,
    concentration,
    volume,
    insert_size,
  }

  const payload = {
    data: {
      type: 'libraries',
      attributes: {
        ...requiredAttributes,
        primary_aliquot_attributes: {
          ...requiredAttributes,
        },
      },
    },
  }

  id ? (payload.data.id = id) : (payload.data.attributes.pacbio_request_id = pacbio_request_id)

  return payload
}

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
 * Fetches all libraries.
 *
 * @param {Object} fetchOptions - The options to fetch libraries with.
 * The options include page, filter, and include.
 * e.g { page: { "size": "24", "number": "1"}, filter: { source_identifier: 'sample1' }, include: 'request,tag,tube' }
 */
async function fetchLibraries(fetchOptions = {}) {
  const includes = new Set(fetchOptions.include ? fetchOptions.include.split(',') : [])
  const requiredIncludes = ['request', 'tag', 'tube']
  requiredIncludes.forEach((item) => includes.add(item))

  const fetchOptionsDefaultInclude = {
    ...fetchOptions,
    include: Array.from(includes).join(','),
  }
  const rootStore = useRootStore()
  const pacbioLibraries = rootStore.api.v2.traction.pacbio.libraries
  const promise = pacbioLibraries.get(fetchOptionsDefaultInclude)
  const response = await handleResponse(promise)

  const { success, body: { data, included = [], meta = {} } = {}, errors = [] } = response
  let libraries = {},
    tubes = {},
    tags = {},
    requests = {}
  if (success && data && data.length > 0) {
    const {
      tubes: included_tubes,
      tags: included_tags,
      requests: included_requests,
    } = groupIncludedByResource(included)
    libraries = dataToObjectById({ data, includeRelationships: true })
    tubes = dataToObjectById({ data: included_tubes })
    tags = dataToObjectById({ data: included_tags })
    requests = dataToObjectById({ data: included_requests })
  }
  return { success, data, errors, meta, libraries, tubes, tags, requests }
}

/**
 * Formats and transforms libraries.
 *
 * @param {Object} libraries - The libraries to format and transform.
 * @param {Object} tubes - The tubes associated with the libraries.
 * @param {Object} tags - The tags associated with the libraries.
 * @param {Object} requests - The requests associated with the libraries.
 * @returns {Array<Object>} - The formatted and transformed libraries.
 */
const formatAndTransformLibraries = (libraries, tubes, tags, requests) =>
  Object.values(libraries)
    .filter((library) => library.tube)
    .map((library) => {
      const { id, request, tag_id, tag, tube, ...attributes } = library
      const tagId = tag_id ?? tag
      const tagGroupId = tags[tagId] ? (tags[tagId].group_id ?? '') : ''
      return {
        id,
        tag_id: String(tagId),
        tube,
        ...attributes,
        tag_group_id: tagGroupId,
        sample_name: requests[request]?.sample_name,
        barcode: tubes[tube]?.barcode,
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
  const { success, errors } = await updateLibrary(library)
  return { success, errors }
}

/**
 * Updates a library with the given fields and updates the store if successful.
 *
 * @param {Object} libraryFields - The fields of the library to update.
 * @returns {Promise<Object>} - An object containing the success status and any errors.
 */
async function updateLibrary(libraryFields) {
  //Validate the libraryFields to ensure that all required fields are present
  const valid = validateLibraryFields(libraryFields)
  if (!valid.success) {
    return valid
  }
  const rootStore = useRootStore()
  const request = rootStore.api.v2.traction.pacbio.libraries
  const payload = libraryPayload(libraryFields)
  const promise = request.update(payload)
  const { success, errors } = await handleResponse(promise)
  return { success, errors }
}

export {
  libraryPayload,
  fetchLibraries,
  updateLibrary,
  exhaustLibrayVolume,
  formatAndTransformLibraries,
}
