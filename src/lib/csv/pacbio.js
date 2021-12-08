import { parse } from 'csv-parse/lib/sync'

const isFloat = (column) =>
  ['volume', 'concentration', 'insert_size', 'genome_size'].includes(column)

/**
 * Converts each header to match the parameter name in the store
 * @param {String} header the header to convert
 * @return {String} the converted header
 */
const normaliseHeader = (header) =>
  header
    .trim()
    .toLocaleLowerCase()
    .replace(/\s+/g, '_')

/**
 * Converts an array of headers to match parameter names in the store
 * @param {Array<String>} headers the headers to convert
 * @return {String} the converted headers
 */
const normaliseHeaders = (headers) => headers.map(normaliseHeader)

const cast = (value, context) => {
  if (context.header) return value
  if (value === '') return undefined
  return isFloat(context.column) ? Number(value) : String(value)
}

/**
 * When given an object where some keys have a value of undefined, returns
 * a new object where those keys are missing
 * Eg. filterUndefinedValues({a: 1, b: undefined)}) // => { a: 1 }
 * @param {Object} record the object to filter
 * @return {Object} Object with no undefined values
 */
const filterUndefinedValues = (record) =>
  Object.fromEntries(Object.entries(record).filter(([, value]) => value !== undefined))

/**
 * Parses the provides CSV contents and passes each record to the callback
 */
const eachRecord = (csv, callback) => {
  const records = parse(csv, {
    bom: true, // Strip any byte-order-markers
    delimiter: ',',
    columns: normaliseHeaders,
    skip_records_with_empty_values: true,
    skip_empty_lines: true,
    trim: true,
    cast,
    onRecord: filterUndefinedValues,
  })
  records.forEach(callback)
}

export { eachRecord }
