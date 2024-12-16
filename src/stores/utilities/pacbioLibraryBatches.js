import useRootStore from '@/stores'
import { handleResponse } from '@/api/ResponseHelper.js'
import { groupIncludedByResource, dataToObjectById } from '@/api/JsonApi.js'

/**
 * Validates and formats a record as payload data.
 *
 * @param {Object} param0 - The record and info object of structure { record, info } where record is the record to validate and format and info is information about the record, such as line number.
 * @param {Array} requests - The list of requests to validate against.
 * @param {Array} tagIds - The list of valid tag IDs.
 * @returns {Object|Error} - Returns the formatted payload data or an error if validation fails.
 */
const validateAndFormatAsPayloadData = ({ record, info }, requests, tags) => {
  const { source, tag, ...attributes } = record
  /**
   * Creates an error with a specific message.
   *
   * @param {string} message - The error message.
   * @returns {Error} - The created error.
   */
  const createError = (message) => new Error(`Invalid record at line ${info.lines}: ${message}`)

  const measurementAttributes = [
    'concentration',
    'insert_size',
    'template_prep_kit_box_barcode',
    'volume',
  ]
  const requiredAttributes = ['source', 'tag', ...measurementAttributes]
  for (const attr of requiredAttributes) {
    if (!record[attr]) {
      return createError(`${attr} is required`)
    }
  }

  const tagObj = tags.find((t) => t.group_id === tag)
  if (!tagObj) {
    return createError(`tag ${tag} not found`)
  }

  const request = requests.find((r) => r.source_identifier === source)
  if (!request) {
    return createError(`source ${source} not found`)
  }

  const measurementAttributesObj = measurementAttributes.reduce((obj, key) => {
    if (attributes[key] !== undefined) {
      obj[key] = attributes[key]
    }
    return obj
  }, {})

  return {
    pacbio_request_id: request.id,
    tag_id: tagObj.id,
    ...measurementAttributesObj,
    primary_aliquot_attributes: {
      tag_id: tagObj.id,
      ...measurementAttributesObj,
    },
  }
}

/**
 * Fetches all requests and tags for given tagset.
 *
 * @param {Object} tagSet - The tag set to fetch tags and requests for.
 * @returns {Promise<Object>} - The fetched tags and requests.
 */
async function fetchTagsAndRequests(sources, tagSet) {
  let requests = [],
    tags = []

  const rootStore = useRootStore()
  let promise = rootStore.api.traction.pacbio.requests.get({
    filter: { source_identifier: sources.join(',') },
  })
  let response = await handleResponse(promise)

  const { success, body: { data } = {} } = response
  if (success && data) {
    requests = Object.values(dataToObjectById({ data, includeRelationships: true }))
  }

  promise = rootStore.api.traction.pacbio.tag_sets.get({
    include: 'tags',
    filter: { name: tagSet },
  })
  response = await handleResponse(promise)

  const { success: successTagSet, body: { included = [] } = {} } = response
  if (!successTagSet || !included) {
    return { requests, tags }
  }

  const { tags: tagsObj } = groupIncludedByResource(included)
  tags = dataToObjectById({ data: tagsObj })
  return { requests, tags: Object.values(tags) }
}

export { validateAndFormatAsPayloadData, fetchTagsAndRequests }
