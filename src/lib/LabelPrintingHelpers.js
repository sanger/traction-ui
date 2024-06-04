/**
 * A suite of helpers to support label printing
 * It is now in the state that it can be used ny multiple components / views
 * Still struggling with how to make objects reactive e.g. WorkflowListType, PrintJobType
 * I also think we could create a composables
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
 * @param {Object} barcodeItem - an object which contains the barcode and other information
 * @returns {Object} - { barcode, first_line, second_line, label_name } label suitable for printing to a tube printer
 * This is a basic label with just the barcode and date
 */
const createBasicTubeBarcodeLabel = (barcodeItem) => {
  const { barcode, date: first_line, barcode: second_line } = barcodeItem
  return { barcode, first_line, second_line, label_name: 'main_label' }
}

/**
 * @param {Object} barcodeItem - an object which contains the barcode and other information
 * @returns {Object} - { barcode, first_line, second_line, third_line, fourth_line, round_label_top_line, label_name } label suitable for printing to a tube printer
 */
const createWorkflowTubeBarcodeLabel = (barcodeItem) => {
  const {
    barcode,
    date: first_line,
    stage: second_line,
    sourceBarcode: third_line,
    parsedSuffixes: fourth_line,
    number: round_label_top_line,
  } = barcodeItem
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
 * @param {Object} barcodeItem - an object which contains the barcode and other information
 * @returns {Object} - { barcode, first_line, second_line, third_line, fourth_line, label_name } label suitable for printing to a plate printer
 */
const createWorkflowPlateBarcodeLabel = (barcodeItem) => {
  const {
    barcode,
    date: first_line,
    stage: second_line,
    sourceBarcode: third_line,
    parsedSuffixes: fourth_line,
  } = barcodeItem
  return { barcode, first_line, second_line, third_line, fourth_line, label_name: 'main_label' }
}

/**
 * @param {Array} barcodeItems - an array of objects which contain the barcode and other information
 * @param {String} createLabelFn - the function to create the label
 * @returns {Array} - An array of BarcodeLabelItem objects suitable for printing
 */
const createBarcodeLabels = ({ barcodeItems, createLabelFn }) => {
  return barcodeItems.map((barcodeItem) => createLabelFn(barcodeItem))
}

/**
 * @param {Object} attributes - any attributes to override the defaults
 *  attributes include:
 *    - sourceBarcodeList: null,
 *    - suffix: null,
 *    - numberOfLabels: null,
 *    - printerName: null,
 *    - copies: 1,
 *    - labelType: 'tube2d',
 *    - labels: null,
 * @returns {Object} - An empty PrintJobType
 * This is used to set the default values for the printJob object
 * creates an instance of PrintJobType with the default attributes and any attributes passed in
 * It also has a payload method to return the payload object
 */
const PrintJobType = (attributes = {}) => {
  const defaultAttributes = {
    sourceBarcodeList: null,
    suffix: null,
    numberOfLabels: null,
    printerName: null,
    copies: 1,
    labelType: 'tube2d', // need to change this to object
    labels: null,
  }

  const instance = {}

  // merge the default attributes with any passed in attributes
  Object.assign(instance, { ...defaultAttributes, ...attributes })

  // set the payload method
  // returns printerName, labels, copies, labelTemplateName
  instance.payload = () => {
    return {
      printerName: instance.printerName,
      labels: instance.labels,
      copies: instance.copies,
      labelTemplateName: instance.labelType.labelTemplateName,
    }
  }

  return instance
}

/**
 * @param {Object} printJob - the printJob object
 * @param {Object} labelType - the labelType object
 * @returns {Object} - A payload object suitable for sending to the server { printerName, labels, copies, labelTemplateName }
 */
const createPayload = ({ printJob, labelType }) => {
  return {
    printerName: printJob.printerName,
    labels: printJob.labels,
    copies: printJob.copies,
    labelTemplateName: labelType.labelTemplateName,
  }
}

export {
  byAttribute,
  createWorkflowDropdownOptions,
  createWorkflowOptions,
  WorkflowItemType,
  WorkflowListType,
  createBasicTubeBarcodeLabel,
  createWorkflowTubeBarcodeLabel,
  createWorkflowPlateBarcodeLabel,
  createBarcodeLabels,
  PrintJobType,
  createPayload,
}
