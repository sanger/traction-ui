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

  const request = requests.find((r) => r.source_identifier === source)
  if (!request) {
    return createError(`source ${source} not found`)
  }

  const tagObj = tags.find((t) => t.group_id === tag)
  if (!tagObj) {
    return createError(`tag ${tag} not found`)
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
 * Checks for duplicate tags in the CSV content.
 *
 * @param {string} csvText - The CSV content as a string.
 * @returns {string|undefined} - Returns an error message if a duplicate or missing tag is found, otherwise undefined.
 */
const hasDuplicateTags = (csvText) => {
  const lines = csvText.split('\n')
  if (lines.length <= 2) {
    // Only header and one line or empty
    return
  }
  const sources = new Set()
  // Skip the header line
  for (const line of lines.slice(1)) {
    if (!line) continue
    const parts = line.split(',')
    if (parts.length < 2 || !parts[1]) {
      return `Tag missing in line: ${line.trim()}`
    }
    const source = parts[1] // The tag is the second column
    if (sources.has(source)) {
      return `Duplicate tag: ${parts[1].trim()}`
    }
    sources.add(source)
  }
  return
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

export { validateAndFormatAsPayloadData, hasDuplicateTags, fetchTagsAndRequests }
