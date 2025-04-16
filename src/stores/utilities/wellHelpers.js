/**
 * Finds the well associated with a request
 * @param  {Object} wells store resources wells
 * @param  {string | Integer} request_id the request id to find
 * @returns {Object} the matching well from the store
 */
const wellFor = (wells, request_id) =>
  Object.values(wells).find((well) => well.requests[0] === request_id.toString())

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

export { wellFor, wellToIndex, wellNameToCoordinate, sourceRegex }
