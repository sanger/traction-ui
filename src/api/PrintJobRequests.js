// TODO: lets look at this again. We can use more javascripty stuff e.g. first class functions
// higher order functions, passing functions as arguments

import store from '@/store'
import handlePromise from '@/api/PromiseHelper'

const printJob = async (printerName, selected, pipeline) => {
  let request = printMyBarcodeRequest()
  let payload = createPrintJobJson(printerName, selected, pipeline)
  return await postPrintJob(request, payload)
}

const labelsFor = (pipeline) => (pipeline != 'ont' ? baseLabel : ontLabel)
const templateIdFor = (pipeline) => store.getters[`traction/${pipeline}/labelTemplateId`]
const formatDate = () => {
  const [, mmm, dd, yyyy] = new Date().toDateString().split(' ')
  return `${dd}-${mmm}-${yyyy.slice(2)}`
}

const createPrintJobJson = (printer_name, selected, pipeline) => {
  let label_template_id = templateIdFor(pipeline)
  let labels = createLabels(selected, pipeline)

  return {
    data: {
      attributes: { printer_name, label_template_id, labels },
    },
  }
}

const baseLabel = (label) => ({
  barcode_text: label.barcode,
  text_1: getTextForSelected(label),
  barcode: label.barcode,
})

const ontLabel = (label) => ({
  barcode_text: label.tubeBarcode,
  text_1: label.name,
  barcode: label.tubeBarcode,
})

const createLabels = (selected, pipelineLower) => {
  const date = formatDate()
  const pipeline = pipelineLower.toUpperCase()
  const labelContent = labelsFor(pipelineLower)

  return {
    body: selected.map((label) => ({
      main_label: {
        pipeline,
        date,
        round_label_top_line: '',
        round_label_bottom_line: '',
        ...labelContent(label),
      },
    })),
  }
}

const getTextForSelected = (selected) => {
  if (selected.type == 'samples') {
    return selected.name
  }
  if (selected.type == 'libraries') {
    return selected.enzyme_name
  }
}

const printMyBarcodeRequest = () => {
  return store.getters.api.printMyBarcode.print_jobs
}

const postPrintJob = async (request, payload) => {
  let promise = request.create({ data: payload })
  return await handlePromise(promise)
}

export {
  printJob,
  createPrintJobJson,
  createLabels,
  getTextForSelected,
  printMyBarcodeRequest,
  postPrintJob,
}

export default printJob
