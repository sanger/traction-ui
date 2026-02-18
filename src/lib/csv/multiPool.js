import { getColumnValues, removeEmptyLines, eachRecord } from './pacbio.js'

/**
 *
 * @param {*} csv - csv file content
 * @param {*} header - name of the header to get the column index for
 * @returns {Integer} column index of the given header in the csv file
 * @throws {Error} if the header is not found in the csv file
 */
const getColumnIndexOfHeader = (csv, header) => {
  const lines = csv.split('\n').filter((line) => line.trim() !== '')
  if (lines.length === 0) return []

  const headerLine = lines[0]
  const headers = headerLine.split(',')
  const columnIndex = headers.indexOf(header)
  if (columnIndex === -1) {
    throw new Error(`Header "${header}" not found in CSV`)
  }

  return columnIndex
}

/**
 * Validates a csv column given the header name based on the provided validation function.
 * @param {*} csv - csv file content
 * @param {*} header - Name of the header to validate
 * @param {*} validateFn - Function that takes the column value and index and returns an error message if the value is invalid, otherwise returns null
 * @returns {Array} Array of error messages for the column, empty if there are no errors
 */
const validateColumn = (csv, header, validateFn) => {
  const errors = []
  // We wrap this in a try catch because getColumnIndexOfHeader will throw an error if the header is not found
  try {
    const columnIndex = getColumnIndexOfHeader(csv, header)
    const columnValues = getColumnValues(csv, columnIndex, true)
    columnValues.forEach((value, index) => {
      const error = validateFn(value, index)
      if (error) errors.push(error)
    })
  } catch (error) {
    errors.push(error.message)
  }
  return errors
}

/**
 * Validates the pool number column in the multi pool csv file.
 * @param {*} csv file content
 * @returns {String | null} error message if the pool number column is invalid, otherwise null
 */
const validatePoolNumberColumn = (csv) =>
  validateColumn(csv, 'Pool Number', (poolNumber, index) => {
    if (!poolNumber) {
      return `Missing pool number on line ${index + 2}`
    }
    if (isNaN(poolNumber)) {
      return `Invalid pool number on line ${index + 2}, pool number must be a number`
    }
    if (Number(poolNumber) < 1) {
      return `Invalid pool number on line ${index + 2}, pool number must be greater than 0`
    }
    // This is a limit based on the max number of pools in the UI. E.g The plate pool_method can be max 96
    // This should probably be per pool_method validation but this is a good catch all to prevent users from uploading files that will break the UI
    if (Number(poolNumber) > 96) {
      return `Invalid pool number on line ${index + 2}, pool number must be less than or equal to 96`
    }
    return null
  })

/**
 * Validates the source identifier column in the multi pool csv file.
 * @param {*} csv file content
 * @returns {String | null} error message if the source identifier column is invalid, otherwise null
 */
const validateSourceIdentifierColumn = (csv) =>
  validateColumn(csv, 'Source Identifier', (sourceIdentifier, index) => {
    if (!sourceIdentifier) {
      return `Missing source identifier on line ${index + 2}`
    }
    return null
  })

/**
 * Renames volume and concentration headers to match the expected headers in the store.
 * @param {*} record - Parsed record from eachRecord function
 * @returns record - with renamed headers
 */
const formatRecord = (record) => {
  record.record['volume'] = record.record['volume_(ul)']
  delete record.record['volume_(ul)']

  record.record['concentration'] = record.record['concentration_(ng/ul)']
  delete record.record['concentration_(ng/ul)']

  return record
}

const parseMultiPoolFile = (csv) => {
  // Remove empty lines from the CSV content
  csv = removeEmptyLines(csv)
  // Check if the CSV content is empty or has only headers
  if (csv.length === 0 || csv.split('\n').length <= 1) {
    return { success: false, errors: ['The provided csv file is empty'] }
  }

  // We validate the pool number and source identifier columns to ensure we have the necessary information to properly parse the file.
  // We do this before parsing the file to avoid unnecessary processing if the file is not valid.

  // Ensure the pool number column is valid before proceeding with parsing the file
  const errors = validatePoolNumberColumn(csv)
  // Ensure the source_identifier column is valid before proceeding with parsing the file
  errors.push(...validateSourceIdentifierColumn(csv))

  if (errors.length) {
    return { success: false, errors: errors }
  }

  const lines = eachRecord(csv, formatRecord, false)
  const records = lines.map((line) => line.result)

  return { success: true, records, errors: [] }
}

export {
  parseMultiPoolFile,
  getColumnIndexOfHeader,
  validateColumn,
  validatePoolNumberColumn,
  validateSourceIdentifierColumn,
}
