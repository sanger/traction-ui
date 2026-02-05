/**
 *
 * @param {*} primaryIndex - row or column number and used as walking direction
 * @param {*} secondaryIndex - row or column number
 * @param {*} walkingDistance - highest value of primaryIndex
 * @returns numeric format like 1,2,3...
 */
const numericFormat = ({ primaryIndex, secondaryIndex, walkingDistance }) => {
  return (
    parseInt(primaryIndex) +
    parseInt(walkingDistance) * (parseInt(secondaryIndex) - 1)
  ).toString()
}

/**
 *
 * @param {*} primaryIndex - row or column number
 * @param {*} secondaryIndex - row or column number
 * @returns Alphanumeric format like A1, B2 etc. If row number is greater than 26, returns in "primaryIndex,secondaryIndex" format
 */
const alphanumericFormat = ({ primaryIndex, secondaryIndex }) => {
  if (primaryIndex > 26) {
    return `${primaryIndex},${secondaryIndex}`
  }

  const aCharCode = 'A'.charCodeAt(0)
  const primaryIndexLetter = String.fromCharCode(aCharCode - 1 + primaryIndex)
  return `${primaryIndexLetter}${secondaryIndex}`
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
}

export { LabwareTypes }
