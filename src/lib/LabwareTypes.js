/**
 * Formats position in numeric format
 * @param {*} row - row number
 * @param {*} column - column number
 * @param {*} numRows - total number of rows in the labware
 * @param {*} numColumns - total number of columns in the labware
 * @param {*} walkingDirection - the direction in which the positions are walked (byRow or byColumn)
 * @returns numeric format like 1,2,3...
 */
const numericFormat = ({ row, column, numRows, numColumns, walkingDirection }) => {
  row = parseInt(row)
  column = parseInt(column)

  if (walkingDirection === 'byColumn') {
    return ((column - 1) * numRows + row).toString()
  } else {
    // byRow fallback
    return ((row - 1) * numColumns + column).toString()
  }
}

/**
 * Formats position in alphanumeric format
 * @param {*} row - row number
 * @param {*} column - column number
 * @param {*} walkingDirection - the direction in which the positions are walked (byRow or byColumn)
 * @returns Alphanumeric format like A1, B2 etc. If row number is greater than 26, number format is returned in the format of row,column (e.g 27,5)
 */
const alphanumericFormat = ({ row, column, walkingDirection }) => {
  // byRow fallback
  const [primary, secondary] = walkingDirection === 'byColumn' ? [row, column] : [column, row]

  if (primary > 26) {
    return `${primary},${secondary}`
  }

  const aCharCode = 'A'.charCodeAt(0)
  const primaryLetter = String.fromCharCode(aCharCode - 1 + primary)
  return `${primaryLetter}${secondary}`
}

const LabwareTypes = {
  MultiPool96: {
    name: '96-well multi pool',
    numRows: 8,
    numColumns: 12,
    walkingDirection: 'byColumn',
    positionFormat: numericFormat,
  },
  Plate96: {
    name: '96-well plate',
    numRows: 8,
    numColumns: 12,
    walkingDirection: 'byColumn',
    positionFormat: alphanumericFormat,
  },
  Plate4: {
    name: '4-well plate',
    numRows: 4,
    numColumns: 1,
    walkingDirection: 'byColumn',
    positionFormat: alphanumericFormat,
  },
  // Tube Rack Pooling layout for flexible pooling.
  TubeRack24: {
    name: '24-tube tube rack',
    numRows: 4,
    numColumns: 6,
    walkingDirection: 'byRows', // Pool numbering goes row first.
    positionFormat: numericFormat,
  },
}

export { LabwareTypes }
