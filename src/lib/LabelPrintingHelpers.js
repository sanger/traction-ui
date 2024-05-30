// needs to be refactored to support the top line of the label

/* 
  TODO: I think semantics are important here.
  We are using suffix for the purpose of printing
  but this actually refers to workflows and options
  e.g. suffixDropdown options should be WorkflowDropdownOptions
*/

/*
 * @example: WorkflowList
  Example format of WorkflowList:
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
 * @param {Array [Object, ...]} WorkflowList
 * @param {String} the attribute to extract from each object
 * @returns [Array] e.g. [attribute, attribute ...]
 * for each object return the named attribute
 */
const byAttribute = (objects, attribute) => {
  return objects.map((object) => object[attribute])
}

/*
 * @param {Array [Object, ...]} WorkflowList
 * @returns {Array} A list which can be used as a drop-down in the format
 * example: [{ label: 'workflow', options: [{text:'text', value: 'value', ...}, ..., { text: 'No suffix', value: null }]}]
 * The last item returned is a no suffix option
 */
const createWorkflowDropdownOptions = (WorkflowList) => {
  return WorkflowList.map((item) => ({
    label: item.workflow,
    options: item.options.map(({ text, value }) => ({
      text,
      value,
    })),
  })).concat([{ text: 'No suffix', value: null }])
}

/*
 * @param {Array [Object, ...]} WorkflowList
 * @returns {Object} e.g. { suffix: {options}, ...}
 */
const workflowByOptions = (options) => {
  return options.reduce((result, options) => {
    return {
      ...result,
      [options.suffix]: options,
    }
  }, {})
}

/*
 * @param {Array [Object, ...]} WorkflowList
 * @returns {Object} A list with the suffix as the key and the option as the value.
 * For each item Ignores the workflow and flattens all options into a single object
 * This allows for searching by suffix
 * example: { SF1: { ...option }, ...}
 */
const createWorkflowOptions = (WorkflowList) => {
  return WorkflowList.reduce((result, { options }) => {
    return {
      ...result,
      ...workflowByOptions(options),
    }
  }, {})
}

// @returns {Object} - An empty SuffixItem with all attributes set to null
const NullSuffixItem = () => ({
  stage: null,
  suffix: null,
  text: null,
  value: null,
  workflow: null,
})

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
  // takes the suffixes, removes any falseys e.g null, undefined and joins them together with a dash
  const parsedSuffixes = suffixes.filter((suffix) => suffix).join('-')

  // takes the sourceBarcode and joins with the parsedSuffixes if there are any with a dash
  const barcode = `${sourceBarcode}${parsedSuffixes ? '-' : ''}${parsedSuffixes}`

  return {
    barcode,
    first_line: date,
    second_line: stage,
    third_line: sourceBarcode,
    fourth_line: parsedSuffixes,
    label_name: 'main_label',
  }
}

/*
 * @param {Array} sourceBarcode - set of sourceBarcodes
 * @param {string} date - date the barcode is created
 * @param {suffixItem} - used for text on labels defaults to NullSuffixItem
 * @param {Number} numberOfLabels - Number of labels to print for each barcode defaults to 0
 * @returns [BarcodeLabelItem, ...} - An array of BarcodeLabelItem objects suitable for printing
 */
const createLabelsFromBarcodes = ({
  sourceBarcodeList,
  date,
  suffixItem = NullSuffixItem,
  numberOfLabels = 0,
} = {}) => {
  const { stage, suffix } = suffixItem

  // takes a number and turns it into an array with a sequence of numbers e.g. [1,2,3,4,5]
  // if number is 0 returns an empty array
  const numberList = Array.from({ length: numberOfLabels }, (v, k) => k + 1)

  // for each sourceBarcode create a BarcodeLabelItem
  return sourceBarcodeList.flatMap((sourceBarcode) => {
    // if numberOfLabels is empty we just want to return a single item with
    if (numberList.length === 0) {
      return createBarcodeLabelItem({ sourceBarcode, date, stage, suffixes: [suffix] })
    } else {
      // if numberList is filled return a BarcodeLabelItem for each one
      return numberList.map((number) =>
        createBarcodeLabelItem({ sourceBarcode, date, stage, suffixes: [suffix, number] }),
      )
    }
  })
}

/**
 * @param {Object} sourceBarcode - original barcode
 * @param {string} date - date the barcode is created
 * @param {String} stage - stage in the workflow
 * @param {Array} suffixes - an array of suffixes to be added to the barcode
 * @param {Number} number - an optional number to be added to the barcode
 * @returns {Object} A Workflow step. This is made up of:
 * barcode - a parsed barcode made up of the sourceBarcode and suffixes added e.g. SQSC-ST1-1
 * date - the date
 * sourceBarcode - the original barcode.
 * parsedSuffixes - suffixes joined together e.g. ST1-1
 * stage - stage in the workflow
 * number - an optional number to be added to the barcode
 */
const WorkflowItemType = ({
  sourceBarcode,
  date,
  stage = '',
  suffixes = [],
  number = null,
} = {}) => {
  // takes the suffixes, removes any falseys e.g null, undefined and joins them together with a dash
  const parsedSuffixes = [...suffixes, number].filter(Boolean).join('-')

  // takes the sourceBarcode and joins with the parsedSuffixes if there are any with a dash
  const barcode = `${sourceBarcode}${parsedSuffixes ? '-' : ''}${parsedSuffixes}`

  return {
    barcode,
    date,
    sourceBarcode,
    parsedSuffixes,
    stage,
    number,
  }
}

const WorkflowListType = ({
  sourceBarcodeList,
  date,
  suffixItem = NullSuffixItem,
  numberOfLabels = 0,
} = {}) => {
  const { stage, suffix } = suffixItem

  // takes a number and turns it into an array with a sequence of numbers e.g. [1,2,3,4,5]
  // if number is 0 returns an empty array
  const numberList = Array.from({ length: numberOfLabels }, (v, k) => k + 1)

  // for each sourceBarcode create a BarcodeLabelItem
  return sourceBarcodeList.flatMap((sourceBarcode) => {
    // if numberOfLabels is empty we just want to return a single item with suffix
    if (numberList.length === 0) {
      return WorkflowItemType({ sourceBarcode, date, stage, suffixes: [suffix] })
    } else {
      // if numberList is filled return a WorkflowItemType for each one
      return numberList.map((number) =>
        WorkflowItemType({ sourceBarcode, date, stage, suffixes: [suffix], number }),
      )
    }
  })
}

export {
  byAttribute,
  createWorkflowDropdownOptions,
  createWorkflowOptions,
  createBarcodeLabelItem,
  createLabelsFromBarcodes,
  WorkflowItemType,
  WorkflowListType,
}
