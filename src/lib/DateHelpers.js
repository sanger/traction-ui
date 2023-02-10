/* 
  @returns {String} representation of current date in format dd-mmm-yy
*/
const getCurrentDate = () => {
  const [, mmm, dd, yyyy] = new Date().toDateString().split(' ')
  return `${dd}-${mmm}-${yyyy.slice(2)}`
}

/**
 * Function to sort alphaNumeric values based on reg expressions given. Thisvsorts
 * @param a
 * @param b
 * @param regExp  Reg expressions for string and numeric parts.
 * @param alphaFirst Flag to sort first on alpha and then numeric or viceversa.
 */
export function regexSort(a, b, regExp, alphaFirst) {
  let aPrim
  let aSec
  let bPrim
  let bSec
  if (!a) return -1
  if (!b) return 1

  const astr = a + ''
  const bstr = b + ''
  const aAlpha = (aPrim = astr.replace(regExp.alpha, ''))
  const bAlpha = (bPrim = bstr.replace(regExp.alpha, ''))
  const aNumericVal = astr.replace(regExp.numeric, '')
  const bNumericVal = bstr.replace(regExp.numeric, '')
  const aNumeric = (aSec = aNumericVal !== '' ? parseInt(aNumericVal, 10) : Number.MAX_VALUE)
  const bNumeric = (bSec = bNumericVal !== '' ? parseInt(bNumericVal, 10) : Number.MAX_VALUE)
  if (!alphaFirst) {
    aPrim = aNumeric
    bPrim = bNumeric
    aSec = aAlpha
    bSec = bAlpha
  }

  if (aPrim === bPrim) {
    return aSec === bSec ? 0 : aSec > bSec ? 1 : -1
  } else {
    return aPrim > bPrim ? 1 : -1
  }
}

/**
 * Sorts alphanumeric strings with alphabetical order  followed by number sort
 */
export const alphaNumericSortDefault = (a, b, alphaFirst) => {
  if (!a) return -1
  if (!b) return 1
  const regAlpha = /[^a-zA-Z]*/g
  const regNumeric = /[^0-9]*/g
  return regexSort(a, b, { alpha: regAlpha, numeric: regNumeric }, alphaFirst)
}

export const flattenObject = (obj) => {
  if (!obj) {
    return {}
  }
  return Object.keys(obj).reduce(
    (acc, cur) =>
      typeof obj[cur] === 'object'
        ? { ...acc, ...flattenObject(obj[cur]) }
        : { ...acc, [cur]: obj[cur] },
    {},
  )
}
export { getCurrentDate }
