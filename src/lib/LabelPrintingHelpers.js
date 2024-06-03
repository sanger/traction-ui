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

// @returns {Object} - An empty WorkflowOptions with all attributes set to null
const NullWorkflowItem = () => ({
  stage: null,
  suffix: null,
  text: null,
  value: null,
  workflow: null,
})

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

/**
 * @param {Object} workflowListType
 * @returns {Array} - An array of WorkflowItemType objects suitable for displaying barcodes
 */
const createWorkflowBarcodeItemList = ({ workflowListType }) => {
  const { sourceBarcodeList, date, workflowItem, numberOfLabels } = workflowListType
  const { stage, suffix } = workflowItem

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

/**
 * @param {Object} sourceBarcodeList - original barcode
 * @param {string} date - date the barcode is created
 * @param {String} workflowItem - a workflow item
 * @param {Number} numberOfLabels - Number of labels to print for each barcode defaults to 0
 * @returns {Object} A WorkflowListType object suitable for displaying barcodes
 * It would be better if createWorkflowBarcodeItemList did not need WorkflowListType but not sure how to do that
 */
const WorkflowListType = ({
  sourceBarcodeList,
  date,
  workflowItem = NullWorkflowItem,
  numberOfLabels = 0,
} = {}) => {
  return {
    sourceBarcodeList,
    date,
    workflowItem,
    numberOfLabels,
    createWorkflowBarcodeItemList,
  }
}

/**
 * @param {Object} workflowListType
 * @returns {Object} - { barcode, first_line, second_line, third_line, fourth_line, round_label_top_line, label_name } label suitable for printing to a tube printer
 */
const createTubeBarcodeLabel = ({ workflowItemType }) => {
  const {
    barcode,
    date: first_line,
    stage: second_line,
    sourceBarcode: third_line,
    parsedSuffixes: fourth_line,
    number: round_label_top_line,
  } = workflowItemType
  return {
    barcode,
    first_line,
    second_line,
    third_line,
    fourth_line,
    round_label_top_line,
    label_name: 'main_label',
  }
}

/**
 * @param {Object} workflowListType
 * @returns {Object} - { barcode, first_line, second_line, third_line, fourth_line, label_name } label suitable for printing to a plate printer
 */
const createPlateBarcodeLabel = ({ workflowItemType }) => {
  const {
    barcode,
    date: first_line,
    stage: second_line,
    sourceBarcode: third_line,
    parsedSuffixes: fourth_line,
  } = workflowItemType
  return { barcode, first_line, second_line, third_line, fourth_line, label_name: 'main_label' }
}

/**
 * @param {Array} workflowBarcodeItems
 * @param {String} labwareType
 * @returns {Array} - An array of BarcodeLabelItem objects suitable for printing
 */
const createBarcodeLabels = ({ workflowBarcodeItems, labwareType }) => {
  const barcodeLabelFns = {
    tube: createTubeBarcodeLabel,
    plate96: createPlateBarcodeLabel,
  }

  const barcodeLabelFn = barcodeLabelFns[labwareType]

  return workflowBarcodeItems.map((workflowItemType) => barcodeLabelFn({ workflowItemType }))
}

/**
 * @returns {Object} - An empty PrintJobType
 * This is used to set the default values for the printJob object
 */
const PrintJobType = () => ({
  sourceBarcodeList: null,
  suffix: null, // Default to No suffix
  numberOfLabels: null,
  printerName: null,
  copies: 1,
  labelType: 'tube2d',
  labels: null,
})

export {
  byAttribute,
  createWorkflowDropdownOptions,
  createWorkflowOptions,
  WorkflowItemType,
  WorkflowListType,
  createTubeBarcodeLabel,
  createPlateBarcodeLabel,
  createBarcodeLabels,
  PrintJobType,
}
