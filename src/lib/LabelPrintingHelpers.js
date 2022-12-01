/*
 * @example: suffixList
  Example format of suffixList:
    [{
      worklow: 'workflow 1', 
      options: [
      {
        "stage": "Stage 1",
        "suffix": "ST1",
        "text": "ST1 - Stage 1",
        "value": "ST1",
        "workflow": "workflow 1"
      },
      ...
    ],
    ...
  }]
*/

/*
 * @param {Array [Object, ...]} suffixList
 * @returns {Array} A list which can be used as a drop-down (Bootstrap only?) in the format
 * example: [{ label: 'workflow', options: [{text:'text', value: 'value', ...}, ..., { text: 'No suffix', value: null }]}]
 * The last item returned is a no suffix option
 */
const createSuffixDropdownOptions = (suffixList) => {
  return suffixList
    .map((item) => ({
      label: item.workflow,
      options: item.options.map(({ text, value }) => ({
        text,
        value,
      })),
    }))
    .concat([{ text: 'No suffix', value: null }])
}

/*
 * @param {Array [Object, ...]} suffixList
 * @returns {Object} e.g. { suffix: {options}, ...}
 */
const suffixesByOption = (options) => {
  return options.reduce((result, options) => {
    return {
      ...result,
      [options.suffix]: options,
    }
  }, {})
}

/*
 * @param {Array [Object, ...]} suffixList
 * @returns {Object} A list with the suffix as the key and the option as the value.
 * For each item Ignores the workflow and flattens all options into a single object
 * This allows for searching by suffix
 * example: { SF1: { ...option }, ...}
 */
const createSuffixItems = (suffixList) => {
  return suffixList.reduce((result, { options }) => {
    return {
      ...result,
      ...suffixesByOption(options),
    }
  }, {})
}

/*
 * @param {String} sourceBarcode - original barcode
 * @param {string} date - date the barcode is created
 * @param {String} stage - stage in the workflow
 * @param {Array} suffixes - an array of suffixes to be added to the barcode
 * @returns {Object} A label which is able to be printed. This is made up of:
 *  barcode - a parsed barcode made up of the sourceBarcode and suffixes added e.g. SQSC-ST1-1
 *  first_line - the date
 *  second_line - the workflow stage
 *  third_line - sourceBarcde. The original barcode.
 *  fourth_line - suffixes joined together e.g. ST1-1
 */
const createBarcodeLabelItem = ({ sourceBarcode, date, stage = '', suffixes = [] } = {}) => {
  // takes the suffixes, removes any nulls and joins them together with a dash
  const parsedSuffixes = suffixes.filter((suffix) => suffix !== null).join('-')

  // takes the sourceBarcode and joins with the parsedSuffixes if there are any with a dash
  const barcode = `${sourceBarcode}${parsedSuffixes ? '-' : ''}${parsedSuffixes}`

  return {
    barcode,
    first_line: date,
    second_line: stage,
    third_line: sourceBarcode,
    fourth_line: parsedSuffixes,
  }
}

export { createSuffixDropdownOptions, createSuffixItems, createBarcodeLabelItem }
