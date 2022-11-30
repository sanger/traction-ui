// import { getCurrentDate } from '@/lib/DateHelpers'

/*
 * @param {Array} A list of all of the suffix items. Needs to be in the format [{worklow: 'workflow', options: [{text:'text', value: 'value', ...}]}, ...]
 * @returns {Array} A list which can be used as a drop-down (Bootstrap only?) in the format [{ label: 'workflow', options: [{text:'text', value: 'value', ...}, ..., { text: 'No suffix', value: null }]}]
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

export { createSuffixDropdownOptions }
