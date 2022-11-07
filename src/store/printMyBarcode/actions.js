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
  return suffix ? barcode.slice(-5) : ''
}

const trimBarcode = (suffix, barcode) => {
  return suffix ? barcode.slice(0, -6) : barcode
}

const actions = {
  printJob,
}

export { printJob, createPrintJobJson }

export default actions
