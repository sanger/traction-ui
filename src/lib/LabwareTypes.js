/**
 *
 * @param {*} row - row number
 * @param {*} column - column number
 * @param {*} numColumns - number of columns in the labware
 * @returns numeric format like 1,2,3...
 */
const numericFormat = (row, column, numColumns) => {
  return (parseInt(row) + parseInt(numColumns) * (parseInt(column) - 1)).toString()
}

/**
 *
 * @param {*} row - row number
 * @param {*} column - column number
 * @returns Alphanumeric format like A1, B2 etc. If row number is greater than 26, returns in "row,column" format
 */
const alphanumericFormat = (row, column) => {
  if (row > 26) {
    return `${row},${column}`
  }

  const aCharCode = 'A'.charCodeAt(0)
  const rowLetter = String.fromCharCode(aCharCode - 1 + row)
  return `${rowLetter}${column}`
}

const LabwareTypes = {
  MultiPool96: {
    name: '96-well multi pool',
    numRows: 8,
    numColumns: 12,
    layoutType: 'byCol',
    positionFormat: numericFormat,
  },
  Plate96: {
    name: '96-well plate',
    numRows: 8,
    numColumns: 12,
    layoutType: 'byCol',
    positionFormat: alphanumericFormat,
  },
  Plate4: {
    name: '4-well plate',
    numRows: 4,
    numColumns: 1,
    layoutType: 'byCol',
    positionFormat: alphanumericFormat,
  },
}

export { LabwareTypes }
