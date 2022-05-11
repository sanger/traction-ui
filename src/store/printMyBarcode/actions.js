import { handleResponse } from '@/api/ResponseHelper'

const printJobV2 = async ({ getters }, params) => {
  const request = getters.printJobV2Request

  const labelTemplateName = getLabelTemplateName(getters)

  const payload = createPrintJobJsonV2(
    params.printer.text,
    params.barcodesList,
    params.copies,
    labelTemplateName,
  )

  const promise = request.create({ data: payload })

  const response = await handleResponse(promise)

  if (!response.success) {
    if (response.data.errors && response.data.errors.length != 0) {
      let errors = response.data.errors.map((e) => e.source.pointer + ' ' + e.detail).join(', ')
      return {
        success: false,
        errors: errors,
      }
    }
  }

  return response
}

const createPrintJobJsonV2 = (printerName, barcodesList, copies, labelTemplateName) => {
  const labels = createLabelsV2(barcodesList)

  return {
    print_job: {
      printer_name: printerName,
      label_template_name: labelTemplateName,
      labels: labels,
      copies: copies,
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

const getLabelTemplateName = (getters) => {
  return getters.tubeLabelTemplateName
}

const actions = {
  printJobV2,
}

export { printJobV2, createPrintJobJsonV2 }

export default actions
