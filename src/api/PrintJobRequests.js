// TODO: lets look at this again. We can use more javascripty stuff e.g. first class functions
// higher order functions, passing functions as arguments

import store from '@/store'
import handlePromise from '@/api/PromiseHelper'

const printJob = async (printerName, selected, pipeline) => {
  let request = printMyBarcodeRequest()
  let payload = createPrintJobJson(printerName, selected, pipeline)
  return await postPrintJob(request, payload)
}

const labelsFor = (pipeline) => (pipeline != 'ont' ? createLabels : createOntLabels)
const templateIdFor = (pipeline) => store.getters[`traction/${pipeline}/labelTemplateId`]
const formatDate = () => {
  const [, mmm, dd, yyyy] = new Date().toDateString().split(' ')
  return `${dd}-${mmm}-${yyyy.slice(2)}`
}

const createPrintJobJson = (printer_name, selected, pipeline) => {
  let label_template_id = templateIdFor(pipeline)
  let labels = labelsFor(pipeline)(selected, pipeline)

  return {
    data: {
      attributes: { printer_name, label_template_id, labels },
    },
  }
}

const createLabels = (selected, pipeline) => {
  const date = formatDate()
  return {
    body: selected.reduce((result, label) => {
      result.push({
        main_label: {
          pipeline: pipeline.toUpperCase(),
          barcode_text: label.barcode,
          date,
          text_1: getTextForSelected(label),
          barcode: label.barcode,
          round_label_top_line: '',
          round_label_bottom_line: '',
        },
      })
      return result
    }, []),
  }
}

const createOntLabels = (selected, pipeline) => {
  const date = formatDate()
  return {
    body: selected.reduce((result, label) => {
      result.push({
        main_label: {
          pipeline: pipeline.toUpperCase(),
          barcode_text: label.tubeBarcode,
          date,
          text_1: label.name,
          barcode: label.tubeBarcode,
          round_label_top_line: '',
          round_label_bottom_line: '',
        },
      })
      return result
    }, []),
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
