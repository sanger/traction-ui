/**
 * Creates a used aliquot object with the given attributes.
 *
 * @param {Object} attributes - The attributes to set on the used aliquot.
 * @returns {Object} The created used aliquot object.
 */
function createUsedAliquot(attributes, initialiseToAvailableVolume = null) {
  /**
   * The default attributes for a used aliquot.
   */
  const defaultUsedAliquotAttributes = {
    source_id: null,
    source_type: null,
    template_prep_kit_box_barcode: null,
    tag_id: null,
    volume: null,
    concentration: null,
    insert_size: null,
    available_volume: null,
    used_volume: null,
    errors: {},
  }
  //Initialise the volume to the available volume of the aliquot if the source type is 'Pacbio::Library' and a function is provided to initialise the volume.
  const isInitialiseVolume =
    initialiseToAvailableVolume != null && attributes.source_type === 'Pacbio::Library'

  let availableVolume = formatValue(
    isInitialiseVolume ? initialiseToAvailableVolume() : attributes?.available_volume,
  )
  /**
   * The used aliquot object.
   * This object is created by merging the default attributes with the given attributes.
   * It also contains methods to validate the used aliquot and to produce a json api compliant payload.
   * @type {Object}
   *
   */
  let usedAliquot = {
    ...defaultUsedAliquotAttributes,
    ...attributes,
    tag_id: (attributes && (attributes.tag || attributes.tag_id)) ?? null,
    volume: isInitialiseVolume ? availableVolume : formatValue(attributes?.volume),
    available_volume: availableVolume,

    /**
     * Sets the request and available volume of the used aliquot based on the source type and libraries.
     *
     * If the source type is 'Pacbio::Request', the request is set to the source ID of the aliquot.
     * Otherwise, the request is set to the request of the library with the same source ID as the aliquot,
     * and the available volume is set to the sum of the available volume of the library and the volume of the aliquot,
     * rounded to two decimal places.
     *
     * @param {Object} libraries - The libraries to use for setting the request and available volume.
     */
    setRequestAndVolume: function (libraries) {
      if (this.source_type == 'Pacbio::Request') {
        this.request = this.source_id
      } else {
        this.request = libraries[this.source_id].request
        this.available_volume = parseFloat(
          libraries[this.source_id].available_volume + this.volume,
        ).toFixed(2)
      }
    },

    /**
     * Returns an array of required aliquot attributes.
     *
     * The returned array always includes 'source_id', 'volume', 'concentration', 'insert_size', and 'template_prep_kit_box_barcode'.
     * If the aliquot is a pool (isPool is true), the array also includes 'tag_id'.
     *
     * @param {boolean} isPool - Whether the aliquot is a pool.
     * @returns {string[]} An array of required aliquot attributes.
     *
     * @example
     * const attributes = requiredAliquotAttributes(true);
     * // attributes is ['source_id', 'volume', 'concentration', 'insert_size', 'template_prep_kit_box_barcode', 'tag_id']
     */
    requiredAliquotAttributes: function (isPool) {
      return [
        'source_id',
        'source_type',
        'volume',
        'concentration',
        'insert_size',
        'template_prep_kit_box_barcode',
        ...(isPool ? ['tag_id'] : []),
      ]
    },

    /**
     * Validates the aliquot based on its required attributes.
     *
     * For each required attribute of the aliquot (as determined by the `requiredAliquotAttributes` method),
     * it checks if the attribute is valid (as determined by the `validateField` method).
     * If all required attributes are valid, it returns true. Otherwise, it returns false.
     * If an attribute is invalid, it adds an error message to the `errors` property of the aliquot.
     *
     * @param {boolean} pooled - Whether the aliquot is a pool. This parameter is passed to the `requiredAliquotAttributes` method.
     * @returns {boolean} Whether the aliquot is valid.
     *
     * @example
     * const isValid = validate(true);
     * // isValid is true if all required attributes are valid, false otherwise
     */
    validate: function (pooled) {
      let isValid = true
      this.requiredAliquotAttributes(pooled).forEach((field) => {
        const isFieldValue = this.validateField(field).length === 0
        isValid = isValid && isFieldValue
      })
      return isValid
    },

    /**
     * Validates a field of the aliquot.
     *
     * If the provided value is not null, it checks the value. Otherwise, it checks the value of the field on the aliquot.
     * If the value is falsy, it sets the error for the field to 'must be present'.
     * If the field is 'volume' and the value is greater than the available volume of the aliquot, it sets the error for the field to 'must be less or equal to available volume'.
     * If there is an error, it sets the error on the aliquot. Otherwise, it deletes the error for the field from the aliquot.
     *
     * @param {string} field - The field to validate.
     * @param {*} value - The value to check. If this parameter is not provided or is null, the method checks the value of the field on the aliquot.
     * @returns {string} The error for the field, or an empty string if the field is valid.
     *
     * @example
     * const error = validateField('volume', 1.5);
     * // error is 'must be less or equal to available volume' if the available volume of the aliquot is less than 1.5
     */
    validateField: function (field, value) {
      const valueToCheck = value != null ? value : this[field]

      let error = ''
      if (!valueToCheck) {
        error = 'must be present'
      }
      if (
        field === 'volume' &&
        this.available_volume != null &&
        parseFloat(valueToCheck) > parseFloat(this.available_volume)
      ) {
        error = 'must be less or equal to available volume'
      }
      if (error) {
        this.errors[field] = error
      } else {
        delete this.errors[field]
      }
      return error
    },

    /**
     * Checks if the current object is valid.
     *
     * The object is considered valid if it exists, is of type 'object', and has a 'request' property.
     *
     * @returns {boolean} Returns true if the object is valid, false otherwise.
     *
     * @example
     * if (!isValidObject()) {
     *   console.error('Invalid object');
     * }
     */
    isValidObject: function () {
      if (!this || typeof this !== 'object' || !this['request'] || !this['source_id']) {
        return false
      }
      return true
    },
    /**
     * Returns an object with the specified attributes of the aliquot.
     * The returned object has the same keys as the provided attribute keys, and the values are the values of the corresponding attributes on the aliquot.
     * @param {string[]} attributeKeys - The keys of the attributes to include in the returned object.
     * @returns {Object} An object with the specified attributes of the aliquot.
     *
     * @example
     * if usedAliquot is { source_id: '1', volume: 10, concentration: 5 }
     * const aliquotAttributes = attributes(['source_id', 'volume']);
     * // aliquotAttributes is { source_id: '1', volume: 10 }
     */
    attributes: function (attributeKeys) {
      return attributeKeys.reduce((acc, key) => {
        acc[key] = this[key]
        return acc
      }, {})
    },

    /**
     * Returns an object with the payload attributes of the aliquot.
     * The returned object includes the 'id', 'source_id', 'template_prep_kit_box_barcode', 'tag_id', 'volume', 'concentration', 'insert_size', and 'source_type' attributes of the aliquot.
     * @returns {Object} An object with the payload attributes of the aliquot.
     */
    payloadAttributes: function () {
      return this.attributes([
        'id',
        'source_id',
        'template_prep_kit_box_barcode',
        'tag_id',
        'volume',
        'concentration',
        'insert_size',
        'source_type',
      ])
    },
  }
  return usedAliquot
}
/**
 * Checks if the provided aliquot object is valid and contains the specified fields.
 * @param {Object} used_aliquot - The aliquot object to validate.
 * @param {string[]} [fields=['request']] - The fields to check for in the aliquot object.
 * @returns {boolean} Returns true if the aliquot object is valid and contains all the specified fields, false otherwise.
 */
function isValidUsedAliquot(used_aliquot, fields = ['request']) {
  if (!used_aliquot || typeof used_aliquot !== 'object') {
    return false
  }

  for (let field of fields) {
    if (!(field in used_aliquot)) {
      return false
    }
  }
  return true
}

/**
 * This function formats the value to a float with 2 decimal places. If the value is not a number, it returns null.
 * @param  value  The value to be formatted.
 * @returns  The formatted value.
 */
const formatValue = (value) => {
  const floatValue = parseFloat(value)
  return isNaN(floatValue) ? null : parseFloat(floatValue.toFixed(2))
}

export { createUsedAliquot, isValidUsedAliquot }
