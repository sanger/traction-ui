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

  return isFloat(context.column) ? Number(value) : String(value)
}
/**
 * Parses the provides CSV contents and passes each record to the callback
 */
const eachRecord = (csv, callback) => {
  const records = parse(csv, {
    bom: true, // Strip any byte-order-markers
    delimiter: ',',
    columns: normaliseHeaders,
    skip_empty_lines: true,
    trim: true,
    cast,
  })
  records.forEach(callback)
}

export { eachRecord }
