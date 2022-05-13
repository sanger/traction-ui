import { handleResponse } from '@/api/ResponseHelper'

const printJobV2 = async ({ getters }, params) => {
  const request = getters.printJobV2Request

  const labelTemplateName = getters.tubeLabelTemplateName

  const payload = createPrintJobJsonV2(params, labelTemplateName)

  const promise = request.create({ data: payload })

  const response = await handleResponse(promise)

  if (!response.success) {
    if (response.data.errors && response.data.errors.length != 0) {
      const errors = response.data.errors.map((e) => e.source.pointer + ' ' + e.detail).join(', ')
      return {
        success: false,
        errors: errors,
      }
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
  // {
  // "barcode": "TRAC-1-1234",
  // "first_line": "PACBIO",
  // "second_line": "TRAC-2-636",
  // "third_line": "04-MAY-22",
  // "label_name": "main_label"
  // }

  return barcodesList.map((barcode) => {
    return {
      first_line: 'DATE',
      second_line: barcode,
      third_line: 'third line',
      barcode: barcode,
      label_name: 'main_label',
    }
  })
}

const actions = {
  printJobV2,
}

export { printJobV2, createPrintJobJsonV2 }

export default actions
