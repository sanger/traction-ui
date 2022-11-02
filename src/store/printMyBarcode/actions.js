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
  printJob,
}

export { printJob, createPrintJobJson }

export default actions
