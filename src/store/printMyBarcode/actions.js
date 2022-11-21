import { handleResponse } from '@/api/ResponseHelper'

const printJob = async ({ getters }, params) => {
  const request = getters.printJobRequest

  const labelTemplateName = getters.tubeLabelTemplateName

  const payload = createPrintJobJson(params, labelTemplateName)

  const promise = request.create({ data: payload })

  const response = await handleResponse(promise)

  if (!response.success) {
    let errors = 'Unknown'
    if (response.data && response.data.errors && response.data.errors.length != 0) {
      errors = response.data.errors.map((e) => e.source.pointer + ' ' + e.detail).join(', ')
    }
    return {
      success: false,
      data: {
        message: errors,
      },
    }
  }

  return response
}

const createPrintJobJson = (params, labelTemplateName) => {
  const labels = createLabelsV2(params)

  return {
    print_job: {
      printer_name: params.printerName,
      label_template_name: labelTemplateName,
      labels: labels,
      copies: params.copies,
    },
  }
}

const createLabelsV2 = (params) => {
  return params.barcodesList.map((barcode) => {
    return {
      barcode: barcode,
      first_line: formatDate(),
      second_line: trimBarcode(params.suffix, barcode),
      third_line: getSuffix(params.suffix, barcode),
      label_name: 'main_label',
    }
  })
}

const formatDate = () => {
  const [, mmm, dd, yyyy] = new Date().toDateString().split(' ')
  return `${dd}-${mmm}-${yyyy.slice(2)}`
}

const getSuffix = (suffix, barcode) => {
  return suffix ? barcode.slice(barcode.lastIndexOf('-') + 1) : ''
}

const trimBarcode = (suffix, barcode) => {
  return suffix ? barcode.slice(0, barcode.lastIndexOf('-')) : barcode
}

/**
 * Creates a print job in PrintMyBarcode
 * @param rootState the vuex rootState object. Provides access to current state
 * @param state Provides access to local state
 * @param {String} printerName The name of the printer to send the print job to
 * @param {Array} labels Should be of a standard structure. See relevant components.
 * @param {Integer} copies Number of copies of labels
 * @returns {Object {success: Boolean, message: String}} Is the print job successful? With a success or failure message
 **/
const createPrintJob = async (
  { rootState, state: { tubeLabelTemplateName } },
  { printerName, labels, copies },
) => {
  // extract the request from the rootState
  const request = rootState.api.printMyBarcode.print_jobs

  const payload = {
    printer_name: printerName,
    label_template: tubeLabelTemplateName,
    labels,
    copies,
  }

  const promise = request.create({ data: payload })

  const response = await handleResponse(promise)

  const { success, data, errors } = response

  // we need to create a final message
  const message = success
    ? // if it was success just send a simple message
      'Barcode(s) successfully printed'
    : // print my barcode does not return the errors in the correct format
    // so we need to extract the errors and turn them into something meaningful
    data?.errors?.length > 0
    ? data.errors.map((e) => e.source.pointer + ' ' + e.detail).join(', ')
    : // otherwise we can just return the errors
      errors

  return { success, message }
}

const actions = {
  printJob,
  createPrintJobJson,
  createPrintJob,
}

export default actions
