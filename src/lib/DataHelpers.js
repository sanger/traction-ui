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
 * Limitations:-
 * If there are more than one level of identical fields, it will be overwritten
 * For eg
 * { name:"Test", type:{ name:"class1"},type1:{type:{name:"class2"}}
 * Here there is only one field called type.name which will be overwritten with 'class2'
 *
 * @param {*} obj - object to flatten
 * @param {*} objectAccessor - accessor for object which is useful to uniquely identify
 *                             a field if there are dupliacte names, useed only in recursive calls
 * @param {*} result - result/flattened object in progress which can be used in recursive calls
 * @returns
 */
export const flattenObject = (obj, objectAccessor, result) => {
  if (!obj) {
    return {}
  }
  return Object.keys(obj).reduce((acc, cur) => {
    return typeof obj[cur] === 'object'
      ? { ...acc, ...flattenObject(obj[cur], cur, acc) }
      : result && Object.keys(result).includes(cur)
      ? { ...acc, [objectAccessor + '.' + cur]: obj[cur] }
      : { ...acc, [cur]: obj[cur] }
  }, {})
}
