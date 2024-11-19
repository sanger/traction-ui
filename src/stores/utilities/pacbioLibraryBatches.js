
import { usePacbioRootStore } from '@/stores/pacbioRoot.js'
import store from '@/store'

/**
 * Validates and formats a record as payload data.
 *
 * @param {Object} param0 - The record and info object of structure { record, info } where record is the record to validate and format and info is information about the record, such as line number.
 * @param {Array} requests - The list of requests to validate against.
 * @param {Array} tagIds - The list of valid tag IDs.
 * @returns {Object|Error} - Returns the formatted payload data or an error if validation fails.
 */
const validateAndFormatAsPayloadData = ({ record, info }, requests, tagIds) => {
  const { source, tag, ...attributes } = record

  /**
   * Creates an error with a specific message.
   *
   * @param {string} message - The error message.
   * @returns {Error} - The created error.
   */
  const createError = (message) => new Error(`Invalid record at line ${info.lines}: ${message}`)

  if (!source || !tag) {
    return createError('source and tag are required')
  }

  const request = requests.find((r) => r.sample_name === source)
  if (!request) {
    return createError(`source ${source} not found`)
  }

  if (!tagIds.includes(tag)) {
    return createError(`tag ${tag} not found`)
  }

  const measurementAttributes = [
    'concentration',
    'insert_size',
    'template_prep_kit_box_barcode',
    'volume',
  ]
  for (const attr of measurementAttributes) {
    if (!attributes[attr]) {
      return createError(`${attr} is required`)
    }
  }
  const measurementAttributesObj = measurementAttributes.reduce((obj, key) => {
    if (attributes[key] !== undefined) {
      obj[key] = attributes[key]
    }
    return obj
  }, {})

  return {
    pacbio_request_id: request.id,
    tag_id: tag,
    ...measurementAttributesObj,
    primary_aliquot_attributes: {
      tag_id: tag,
      ...measurementAttributesObj,
    },
  }
}

/**
 * Checks for duplicate sources in the CSV content.
 *
 * @param {string} csvText - The CSV content as a string.
 * @returns {boolean} - True if duplicate sources are found, otherwise false.
 */
const hasDuplicateSources = (csvText) => {
  const lines = csvText.split('\n')
  if (lines.length <= 2) {
    // Only header and one line or empty
    return false
  }
  const sources = new Set()
  for (const line of lines.slice(1)) {
    // Skip the header line
    const source = line.split(',')[0] // The source is the first column
    if (sources.has(source)) {
      return true
    }
    sources.add(source)
  }

  return false
}

/**
 * Fetches all requests and tags for given tagset.
 *
 * @param {Object} tagSet - The tag set to fetch tags and requests for.
 * @returns {Promise<Object>} - The fetched tags and requests.
 */
async function fetchTagsAndRequests(tagSet) {
  const pacbioRootStore = usePacbioRootStore()
  await store.dispatch('traction/pacbio/requests/setRequests')
  const requests = store.getters['traction/pacbio/requests/requests']
  await pacbioRootStore.fetchPacbioTagSets()
  const tags = tagSet.tags.map((tag) => pacbioRootStore.tags[tag.id ?? tag])
  return { requests, tags }
}

export { validateAndFormatAsPayloadData, hasDuplicateSources, fetchTagsAndRequests }
