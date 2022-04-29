import { handleResponse } from '@/api/ResponseHelper'

const printJobV2 = async ({ getters }, params) => {
  const request = getters.printJobV2Request

  const labelTemplateName = getLabelTemplateName(params.printer, getters)

  const payload = createPrintJobJsonV2(
    params.printer.text,
    params.barcodesList,
    params.copies,
    labelTemplateName,
  )

  const promise = request.create({ data: payload })

  const response = await handleResponse(promise)

  if (!response.success) {
    if (response.data.errors.length != 0) {
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

const getLabelTemplateName = (printer, getters) => {
  if (printer.type === 'squix') {
    return getters.squixLabelTemplateName
  } else if (printer.type === 'toshiba') {
    return getters.toshibaLabelTemplateName
  }
}

const createLabelsV2 = (barcodesList) => {
  // {
  //   top_line: top_line(tube),
  //   middle_line: middle_line(tube),
  //   bottom_line: bottom_line(tube),
  //   round_label_top_line: round_label_top_line(tube),
  //   round_label_bottom_line: round_label_bottom_line(tube),
  //   barcode: barcode(tube),
  //   label_name: 'main_label'
  // }

  return barcodesList.map((barcode) => {
    return {
      top_line: 'DATE',
      bottom_line: barcode,
      barcode: barcode,
      label_name: 'main_label',
    }
  })
}

const actions = {
  printJobV2,
}

export { printJobV2 }

export default actions
