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

export { validateAndFormatAsPayloadData }
