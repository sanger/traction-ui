const validateAndFormatAsPayloadData = ({ record, info }, requests, tagIds) => {
  const { source, tag, ...attributes } = record

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
