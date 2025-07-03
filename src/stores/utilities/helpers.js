/**
 * Returns a barcode not found error messag
 * @param {String} barcode - A barcode
 * @returns {String} String to be used in a barcode not found error message
 */
const barcodeNotFound = (barcode) =>
  `${barcode} could not be found. Barcode should be in the format barcode:well for plates (eg. DN123S:A1) or just barcode for tubes.`

/**
 * This regular expression matches string that start with an alphanumeric string or hyphens (captured in a group called 'barcode')
 * followed by an optional colon and a well name (captured as 'wellName').
 * The well name is a letter followed by a number or two numbers.
 *
 * @type {RegExp}
 * @example "TRAC-1:A1"
 */
const sourceRegex = /^(?<barcode>[\w-]+)(:(?<wellName>\w[0-9]{1,2})){0,1}$/

export { barcodeNotFound, sourceRegex }
