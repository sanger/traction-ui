import { handleResponse } from '@/api/ResponseHelper'

const printJobV2 = async ({ getters }, params) => {
  const request = getters.printJobV2Request
  const payload = createPrintJobJsonV2(params.printerName, params.barcodesList, params.copies)

  const promise = request.create({ data: payload })

  const response = await handleResponse(promise)

  if (!response.success || response.data.errors.length != 0) {
    return {
      success: false,
      errors: response.data.errors.map((e) => e.detail).join(', '),
    }
  }

  return response

  // Mock successful response
  // return { success: true }
}

const createPrintJobJsonV2 = (printerName, barcodesList, copies) => {
  const labels = createLabelsV2(barcodesList)

  return {
    print_job: {
      printer_name: printerName,
      label_template_name: 'swipecard_barcode_template',
      labels: labels,
      copies: copies,
    },
  }
}

const createLabelsV2 = (barcodesList) => {
  return barcodesList.map((barcode) => {
    return { test_attr: 'test1', barcode: barcode, label_name: 'location1' }
  })
}

const actions = {
  printJobV2,
}

export { printJobV2 }

export default actions
