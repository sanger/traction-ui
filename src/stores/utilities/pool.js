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
  const requiredPoolAttrs = [
    'template_prep_kit_box_barcode',
    'volume',
    'concentration',
    'insert_size',
  ]
  let isValid = true

  const aliquotEntries = Object.entries(used_aliquots)
  aliquotEntries.forEach(([key, used_aliquot]) => {
    const usedAliquotValid = used_aliquot.validate(pooled)
    isValid = isValid && usedAliquotValid
    if (aliquotEntries.some(([k, obj]) => obj.tag_id === used_aliquot.tag_id && k !== key)) {
      used_aliquot.errors['tag_id'] = 'duplicated'
      isValid = false
    }
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
          used_aliquot.payloadAttributes(),
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

export { validate, payload }
