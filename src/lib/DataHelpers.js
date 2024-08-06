/**
 * Function to sort alphaNumeric values based on reg expressions given.
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
 * Sorts alphanumeric strings .The default way sorting in alphabetical order followed by number sort
 */
export const alphaNumericSortDefault = (a, b, alphaFirst) => {
  if (!a) return -1
  if (!b) return 1
  const regAlpha = /[^a-zA-Z]*/g
  const regNumeric = /[^0-9]*/g
  return regexSort(a, b, { alpha: regAlpha, numeric: regNumeric }, alphaFirst)
}

/**
 * Flatten an object with nested objects
 *
 * If there are repeated fields of same name, it will flattened with [parentFieldName.fieldName] from it's
 * second occurrence onwards
 * e.g
 * { name: 'Person1',job: { name: 'Job1'}} is flattened to {name:'Person1,job.name:"Job1"}
 *
 * @param {*} obj - object to flatten
 * @param {*} parentKey = the key of the parent object
 * @param {*} result - result/flattened object in progress which can be used in recursive calls
 * @returns {Array} - flattened object
 */
export const flattenObject = (obj, parentKey) => {
  if (!obj) {
    return {}
  }
  let result = {}

  Object.keys(obj).forEach((key) => {
    const value = obj[key]
    const _key = parentKey ? parentKey + '.' + key : key
    if (typeof value === 'object') {
      result = { ...result, ...flattenObject(value, _key) }
    } else {
      result[_key] = value
    }
  })

  return result
}
