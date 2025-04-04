/**
 * Retrieves a specific well from the wells based on a request ID.
 *
 * @param {Object} {wells, requests} - An object containing wells and requests from store.
 * @param {string|number} request_id - The ID of the request.
 * @returns {Object} The well associated with the given request ID.
 */
const wellFor = ({ wells, requests }, request_id) => wells[requests[request_id].well]

/**
 * Finds the well associated with a ont_request
 * @param {Object} resources Ont VueX store resources object
 * @returns {Object} the matching well from the store
 */
const ontWellFor = ({ wells }, request_id) =>
  Object.values(wells).find((well) => well.requests[0] == request_id)

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

/**
 * This regular expression matches string that start with an alphanumeric string or hyphens (captured in a group called 'barcode')
 * followed by an optional colon and a well name (captured as 'wellName').
 * The well name is a letter followed by a number or two numbers.
 *
 * @type {RegExp}
 * @example "TRAC-1:A1"
 */
const sourceRegex = /^(?<barcode>[\w-]+)(:(?<wellName>\w[0-9]{1,2})){0,1}$/

export { wellFor, wellToIndex, wellNameToCoordinate, sourceRegex, ontWellFor }
