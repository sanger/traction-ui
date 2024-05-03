import _ from 'lodash'
const usedAliquotAttributes = {
  source_id: null,
  template_prep_kit_box_barcode: null,
  tag_id: null,
  volume: null,
  concentration: null,
  insert_size: null,
}

/**
 * This function takes a boolean `isPool` and returns an array of required attributes.
 * The returned array always includes 'source_id', 'volume', 'concentration', and 'insert_size'.
 * If `isPool` is true, the array also includes 'tag_id'.
 *
 * @param {boolean} isPool - A boolean indicating whether the attributes are for a pool.
 * @returns {string[]} The array of required attributes.
 */
const requiredAliquotAttributes = (isPool) => [
  'source_id',
  'volume',
  'concentration',
  'insert_size',
  'template_prep_kit_box_barcode',
  ...(isPool ? ['tag_id'] : []),
]

/**
 * This function takes an `attributes` object and returns a new used_aliquot object.
 * It spreads the `usedAliquotAttributes` and the `attributes` into a new object, with the `attributes` overwriting any matching properties in `used_aliquotAttributes`.
 *
 * @param {Object} attributes - The attributes for the new used_aliquot.
 * @returns {Object} The new used_aliquot object with the `usedAliquotAttributes` and the `attributes`.
 */
const createUsedAliquot = (attributes) => {
  return {
    ...usedAliquotAttributes,
    ...attributes,
  }
}

/**
 * Validates a set of used_aliquots and the pool.
 * Checks if all required attributes are present in each used_aliquot and if there are no duplicate tags.
 * If a used_aliquot is missing a required attribute or there are duplicate tags, it adds an error message to the used_aliquot.
 * These error messages is accessed in components through the 'errors' property of each used_aliquot.
 * The function returns true if all used_aliquots are valid and there are no duplicate tags, false otherwise.
 *
 * @param {Object} used_aliquots - The used_aliquots to validate. Each key is a used_aliquot id and each value is a used_aliquot object.
 * @returns {boolean} Returns true if all used_aliquots are valid and there are no duplicate tags, false otherwise.
 *
 * @example
 * const used_aliquots = {
 *   '1': { tag_id: 'tag1', volume: 10, concentration: 5, insert_size: 1000,source_id:'1' },
 *   '2': { tag_id: 'tag2', volume: 10, concentration: 5, insert_size: 1000,source_id:'1'},
 * };
 * const isValid = validate(used_aliquots); // returns true
 */
const validate = ({ used_aliquots, pool }) => {
  const pooled = Object.keys(used_aliquots).length > 1
  const requiredAliquotAttrs = requiredAliquotAttributes(pooled)
  const requiredPoolAttrs = [
    'template_prep_kit_box_barcode',
    'volume',
    'concentration',
    'insert_size',
  ]
  const aliquotEntries = Object.entries(used_aliquots)
  let isValid = true

  aliquotEntries.forEach(([key, used_aliquot]) => {
    const errors = {}
    requiredAliquotAttrs.forEach((field) => {
      const error = validateFieldForUsedAliquot(used_aliquot, field)
      if (error) {
        errors[field] = error
        isValid = false
      }
    })
    if (aliquotEntries.some(([k, e]) => e.tag_id === used_aliquot.tag_id && k !== key)) {
      errors['tag_id'] = 'duplicated'
      isValid = false
    }
    used_aliquot['errors'] = errors
  })

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
/**
 * Validates a specific field for a used aliquot.
 *
 * @param {Object} used_aliquot - The used aliquot to validate.
 * @param {string} field - The field to validate.
 * @param {*} value - The value to validate. If null, the function will use the value of the field in the used aliquot.
 * @returns {string} - Returns a string with the validation error message if the validation fails, otherwise returns an empty string.
 *
 * @example
 * // Example usage:
 * const aliquot = {
 *   volume: 10,
 *   available_volume: 20
 * };
 * console.log(validateFieldForUsedAliquot(aliquot, 'volume', 30)); // Outputs: 'must be less or equal to available volume'
 * console.log(validateFieldForUsedAliquot(aliquot, 'volume', 10)); // Outputs: ''
 */
const validateFieldForUsedAliquot = (used_aliquot, field, value) => {
  const valueToCheck = value != null ? value : used_aliquot[field]
  if (!valueToCheck) {
    return 'must be present'
  }
  if (
    field === 'volume' &&
    used_aliquot.available_volume != null &&
    valueToCheck > used_aliquot.available_volume
  ) {
    return 'must be less or equal to available volume'
  }
  return ''
}

/**
 * Produce a json api compliant payload
 *
 * @param {Object}
 *
 * @example
 * { data: { type: 'pools', attributes: { used_aliquot_attributes: [ used_aliquot1, used_aliquot2 ... ], template_prep_kit_box_barcode, volume, concentration, insert_size}}}
 */
const payload = ({ used_aliquots, pool }) => {
  const { template_prep_kit_box_barcode, volume, concentration, insert_size } = pool
  return {
    data: {
      type: 'pools',
      id: pool.id,
      attributes: {
        used_aliquots_attributes: Object.values(used_aliquots).map((used_aliquot) =>
          //pick is a lodash function that returns a copy of the object with only the specified keys
          _.pick(used_aliquot, [
            'id',
            'source_id',
            'template_prep_kit_box_barcode',
            'tag_id',
            'volume',
            'concentration',
            'insert_size',
            'source_type',
          ]),
        ),
        primary_aliquot_attributes: {
          template_prep_kit_box_barcode,
          volume,
          concentration,
          insert_size,
        },
        template_prep_kit_box_barcode,
        volume,
        concentration,
        insert_size,
      },
    },
  }
}

export { usedAliquotAttributes, createUsedAliquot, validate, payload, validateFieldForUsedAliquot }
