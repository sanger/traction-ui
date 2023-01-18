/**
 * Finds the well associated with a ont_request
 * @param {Object} resources Ont VueX store resources object
 * @returns {Object} the matching well from the store
 */
const wellFor = ({ resources }, { ont_request_id }) =>
  Object.values(resources.wells).find((well) => well.requests[0] == ont_request_id)

/**
 * Calculate well index, enumerating by column. (A1 => 0, B1 => 1...)
 * @param {String} position the well co-ordinate (eg. A1)
 * @param {Number} numberOfRows number of rows on the plate
 * @returns {Number} The index of the well in column order
 */
const wellToIndex = ({ position }, numberOfRows = 8) => {
  const [col, row] = wellNameToCoordinate(position)
  return col * numberOfRows + row
}

/**
 * Calculate well coordinates (starting at [0, 0] <= A1) from position.
 * @param {String} position the well co-ordinate (eg. A1)
 * @returns {Array} The well-coordinates [column, row]
 */
const wellNameToCoordinate = (position) => [
  Number.parseInt(position.substring(1)) - 1,
  position.toUpperCase().charCodeAt(0) - 65,
]

export { wellFor, wellToIndex, wellNameToCoordinate }
