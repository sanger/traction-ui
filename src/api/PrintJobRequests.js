import store from '@/store'
import moment from 'moment'
import handlePromise from '@/api/PromiseHelper'

const printJob = async (printerName, selected) => {
  let request = printMyBarcodeRequest()
  let payload = createPrintJobJson(printerName, selected)
  let resp = await postPrintJob(request, payload)
  return resp
}

const createPrintJobJson = (printerName, selected) => {
  let labelTemplateId = store.getters.labelTemplateId
  let labels = createLabels(selected)
  return { data: { attributes: { printer_name: printerName, label_template_id: labelTemplateId, labels: labels } } }
}

const createLabels = (selected) => {
  let body = []
  let pipeline = 'SAPHYR'

  for (let i in selected) {
    let text = getTextForSelected(selected[i])

    let label = {
      pipeline: pipeline,
      barcode_text: selected[i].barcode,
      date: moment().format('MMMM Do YYYY'),
      text_1: text,
      barcode: selected[i].barcode,
      round_label_top_line: '',
      round_label_bottom_line: '',
    }

    body.push({ main_label: label })
  }
  return { body: body }
}

const getTextForSelected = (selected) => {
  let text
  if (selected.type == 'samples') {
    text = selected.name
  } else if (selected.type == 'libraries') {
    text = selected.enzyme_name
  }
  return text
}

const printMyBarcodeRequest = () => {
  return store.getters.api.printMyBarcode.print_jobs
}

const postPrintJob = async (request, payload) => {
  let promise = request.create(payload)
  return await handlePromise(promise)
}

export {
  printJob,
  createPrintJobJson,
  createLabels,
  getTextForSelected,
  printMyBarcodeRequest,
  postPrintJob
}

export default printJob
