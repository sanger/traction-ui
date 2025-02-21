import { handleResponse } from '@/api/ResponseHelper.js'
import { groupIncludedByResource, dataToObjectById } from '@/api/JsonApi.js'
import useRootStore from '@/stores/index.js'

/**
 * Fetches all libraries.
 *
 * @param {Object} getPacbioLibraryResources - The options to fetch libraries with.
 * The options include page, filter, and include.
 * e.g { page: { "size": "24", "number": "1"}, filter: { source_identifier: 'sample1' }, include: 'request,tag,tube' }
 */
async function getPacbioLibraryResources(fetchOptions = {}) {
  const includes = new Set(fetchOptions.include ? fetchOptions.include.split(',') : [])
  const requiredIncludes = ['request', 'tag', 'tube']
  requiredIncludes.forEach((item) => includes.add(item))

  const fetchOptionsDefaultInclude = {
    ...fetchOptions,
    include: Array.from(includes).join(','),
  }
  const request = useRootStore().api.traction.pacbio.libraries
  const response = await handleResponse(request.get(fetchOptionsDefaultInclude))

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
const buildLibraryResourcePayload = ({
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
 * Updates a library with the given fields and updates the store if successful.
 *
 * @param {Object} libraryFields - The fields of the library to update.
 * @returns {Promise<Object>} - An object containing the success status and any errors.
 */
async function updatePacbioLibraryResource(libraryFields) {
  const request = useRootStore().api.traction.pacbio.libraries
  const promise = request.update(buildLibraryResourcePayload(libraryFields))
  const response = await handleResponse(promise)
  return { success: response.success, errors: response.errors, updatedLibrary: response.body }
}

export { getPacbioLibraryResources, updatePacbioLibraryResource, buildLibraryResourcePayload }
