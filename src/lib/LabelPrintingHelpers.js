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
 * @param {Array [Object, ...]}
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
 * @param {Array [Object, ...]}
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
 * @param {Array [Object, ...]}
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

export { createSuffixDropdownOptions, createSuffixItems }
