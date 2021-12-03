/**
 * Finds the well associated with a pacbio_request
 * @param {Object} resources PacbioVueX store resources object
 * @returns {Object} the matching well from the store
 */
const wellFor = ({ resources }, { pacbio_request_id }) =>
  resources.wells[resources.requests[pacbio_request_id].well]

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
