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
 * Processes each record in the CSV content using the provided callback function.
 *
 * @param {string} csv - The CSV content as a string.
 * @param {Function} callback - The callback function to process each record.
 * @param {...any} args - Additional arguments to pass to the callback function.
 * @returns {Array|Object} - The processed records or an error object if an error occurs.
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
    // If callback does not return anything, we just add the record to the return
    if (!result) {
      retRecords.push(record)
    } else if (result instanceof Error) {
      // If callback returns an error, we return the error and the record
      return { error: result.message, record }
    } else {
      // If callback returns a result, we add the record and the result to the return
      retRecords.push({ ...record, result })
    }
  }
  return retRecords
}

export { eachRecord }
