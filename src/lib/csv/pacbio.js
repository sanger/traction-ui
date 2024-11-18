import { parse } from 'csv-parse/browser/esm/sync'

const castFloat = (value) => Number(value)
const castString = (value) => String(value)

// Handles the casting of columns. By default, unless specified here, a column
// will be cast to a String
const columnCasting = {
  volume: castFloat,
  concentration: castFloat,
  insert_size: castFloat,
  genome_size: castFloat,
}

const castFor = (column) => columnCasting[column] || castString

/**
 * Converts each header to match the parameter name in the store
 * @param {String} header the header to convert
 * @return {String} the converted header
 */
const normaliseHeader = (header) => header.trim().toLocaleLowerCase().replace(/\s+/g, '_')

/**
 * Converts an array of headers to match parameter names in the store
 * @param {Array<String>} headers the headers to convert
 * @return {Array<String>} the converted headers
 */
const normaliseHeaders = (headers) => headers.map(normaliseHeader)

/**
 * Validate Headers
 * @param {Array<String>} headers the headers to convert
 * @return {Array<String>} the converted headers
 */
const validateHeaders = (normaliser) => (unormalizedHeaders) => {
  const headers = normaliser(unormalizedHeaders)
  if (headers.includes('source')) return headers

  throw `Could not find a 'source' header in ${headers}`
}

const cast = (value, context) => {
  if (context.header) return value
  if (value === '') return undefined
  return castFor(context.column)(value)
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
 * Column headers are assumed to be provided in the first row
 * Each record will have keys corresponding to each
 */
// const eachRecord = (csv, callback) => {
//   parse(csv, {
//     bom: true, // Strip any byte-order-markers
//     delimiter: ',',
//     columns: validateHeaders(normaliseHeaders),
//     skip_records_with_empty_values: true,
//     skip_empty_lines: true,
//     trim: true,
//     info: true,
//     cast,
//     onRecord: filterUndefinedValues,
//   }).forEach(callback)
// }

/**
 * Parses the provided CSV contents and returns an array of records or an error string
 * Column headers are assumed to be provided in the first row
 * Each record will have keys corresponding to each
 * @param {string} csv - The CSV content to parse
 * @param {function} callback - The callback function to call with each record
 * @return {Array<Object>|string} An array of valid records or an error string
 */
const eachRecord = (csv, callback, ...args) => {
  const records = parse(csv, {
    bom: true, // Strip any byte-order-markers
    delimiter: ',',
    columns: validateHeaders(normaliseHeaders),
    skip_records_with_empty_values: true,
    skip_empty_lines: true,
    trim: true,
    info: true,
    cast,
  }).map(filterUndefinedValues)

  let retRecords = []
  for (const record of records) {
    const result = callback(record, ...args)
    if (!result) {
      retRecords.push(record)
    } else if (result instanceof Error) {
      return { error: result.message, record }
    } else {
      retRecords.push({ ...record, result })
    }
  }
  return retRecords
}

export { eachRecord }
