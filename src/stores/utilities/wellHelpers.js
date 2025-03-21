/**
 * Retrieves a specific well from the resources based on a PacBio request ID.
 *
 * @param {Object} resources - An object containing wells and requests from pacbioPoolCreate store.
 * @param {string|number} request_id - The ID of the request.
 * @returns {Object} The well associated with the given request ID.
 */
const wellFor = (resources, request_id) => resources.wells[resources.requests[request_id].well]

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
