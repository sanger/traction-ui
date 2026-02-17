import { getColumnValues, removeEmptyLines } from './pacbio.js'

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

const validateColumn = (csv, header, validateFn) => {
  const errors = []
  const columnIndex = getColumnIndexOfHeader(csv, header)
  const columnValues = getColumnValues(csv, columnIndex, true)
  columnValues.forEach((value, index) => {
    const error = validateFn(value, index)
    if (error) errors.push(error)
  })
  return errors
}

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

const validateSourceIdentifierColumn = (csv) =>
  validateColumn(csv, 'Source Identifier', (sourceIdentifier, index) => {
    if (!sourceIdentifier) {
      return `Missing source identifier on line ${index + 2}`
    }
    return null
  })

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

  // const lines = eachRecord(csv, () => {}, false)
  return { success: true, errors: [] }
}

export {
  parseMultiPoolFile,
  getColumnIndexOfHeader,
  validateColumn,
  validatePoolNumberColumn,
  validateSourceIdentifierColumn,
}
