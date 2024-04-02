import { checkFeatureFlag } from '@/api/FeatureFlag'

const libraryAttributes = {
  pacbio_request_id: null,
  template_prep_kit_box_barcode: null,
  tag_id: null,
  volume: null,
  concentration: null,
  insert_size: null,
}

const requiredLibraryAttributes = (isPool) => [
  'pacbio_request_id',
  'volume',
  'concentration',
  'insert_size',
  'template_prep_kit_box_barcode',
  ...(isPool ? ['tag_id'] : []),
]

const newLibrary = (attributes) => {
  return {
    ...libraryAttributes,
    ...attributes,
  }
}

/**
 * This method will check the pool and each library to ensure that:
 *  * required fields are present
 *  * tags are unique
 **/
const validate = ({ libraries, pool }) => {
  const pooled = Object.keys(libraries).length > 1
  const requiredPoolAttrs = [
    'insert_size',
    'concentration',
    'volume',
    'template_prep_kit_box_barcode',
  ]
  let isValid = true

  for (const [key, library] of Object.entries(libraries)) {
    const errors = {}
    requiredLibraryAttributes(pooled).forEach((field) => {
      if (!library[field] && library[field] !== 0) {
        isValid = false
        errors[field] = 'must be present'
      }
    })

    if (Object.entries(libraries).some(([k, e]) => e.tag_id === library.tag_id && k !== key)) {
      isValid = false
      errors['tag_id'] = 'duplicated'
    }
    library['errors'] = errors
  }

  pool.errors = {}
  requiredPoolAttrs.forEach((field) => {
    // We check its not 0 to prevent false errors as 0 is valid but !0 returns true
    if (!pool[field] && pool[field] !== 0) {
      pool.errors[field] = 'must be present'
      isValid = false
    }
  })

  return isValid
}

const extractLibraryAttributes = ({
  id,
  pacbio_request_id,
  template_prep_kit_box_barcode,
  tag_id,
  volume,
  concentration,
  insert_size,
}) => {
  return {
    id,
    pacbio_request_id,
    template_prep_kit_box_barcode,
    tag_id,
    volume,
    concentration,
    insert_size,
  }
}

const extractPoolAttributes = ({
  template_prep_kit_box_barcode,
  volume,
  concentration,
  insert_size,
}) => {
  return {
    template_prep_kit_box_barcode,
    volume,
    concentration,
    insert_size,
  }
}

/*
  produce a json api compliant payload
  e.g. { data: { type: 'pools', attributes: { library_attributes: [ library1, library2 ... ], template_prep_kit_box_barcode, volume, concentration, insert_size}}}
*/
const payload = async ({ libraries, pool }) => {
  const data = {
    type: 'pools',
    id: pool.id,
    attributes: {
      library_attributes: Object.values(libraries).map((library) =>
        extractLibraryAttributes(library),
      ),
      ...extractPoolAttributes(pool),
    },
  }

  // Add primary aliquot to payload if feature flag is enabled
  const flag = await checkFeatureFlag('dpl_989_ui')
  if (flag) {
    data.attributes.primary_aliquot_attributes = {
      ...extractPoolAttributes(pool),
    }
  }

  return { data }
}

export { libraryAttributes, newLibrary, validate, payload }
