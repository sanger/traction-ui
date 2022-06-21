import { handleResponse } from '@/api/ResponseHelper'

// When PrintJobRequest and PMB v1 API is updated to use PMB v2
// Then, rename the printJobV2 function here to not include v2
// The rest of the app doesn't care how we are printing things, and that way,
// if we updated to V3 for instance, the changes could be isolated here.
const printJobV2 = async ({ getters }, params) => {
  const request = getters.printJobV2Request

  const labelTemplateName = getters.tubeLabelTemplateName

  const payload = createPrintJobJsonV2(params, labelTemplateName)

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

const createPrintJobJsonV2 = (params, labelTemplateName) => {
  const labels = createLabelsV2(params.barcodesList)

  return {
    print_job: {
      printer_name: params.printerName,
      label_template_name: labelTemplateName,
      labels: labels,
      copies: params.copies,
    },
  }
}

const createLabelsV2 = (barcodesList) => {
  return barcodesList.map((barcode) => {
    return {
      barcode: barcode,
      first_line: formatDate(),
      second_line: barcode,
      third_line: '',
      label_name: 'main_label',
    }
  })
}

const formatDate = () => {
  const [, mmm, dd, yyyy] = new Date().toDateString().split(' ')
  return `${dd}-${mmm}-${yyyy.slice(2)}`
}

const actions = {
  printJobV2,
}

export { printJobV2, createPrintJobJsonV2 }

export default actions
