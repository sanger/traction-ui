import store from '@/store'
import moment from 'moment'
import handlePromise from '@/api/PromiseHelper'

const printJob = async (printerName, selected) => {
  let request = printMyBarcodeRequest()
  let payload = createPrintJobJson(printerName, selected)
  return await postPrintJob(request, payload)
}

const createPrintJobJson = (printerName, selected) => {
  let pipeline = getPipeline()
  if (pipeline != "ont") {
    let labelTemplateId = store.getters[`traction/${pipeline}/labelTemplateId`]
    let labels = createLabels(selected)
    return { data: { attributes: { printer_name: printerName, label_template_id: labelTemplateId, labels: labels } } }
  } else {
    let labels = createOntLabels(selected)
    return { data: { attributes: { printer_name: printerName, labels: labels } } }
  }
}

const createLabels = (selected) => {
  return {
    body: selected.reduce((result, label) => {
      result.push( {
        main_label: {
          pipeline: getPipeline().toUpperCase(),
          barcode_text: label.barcode,
          date: moment().format('DD-MMM-YY'),
          text_1: getTextForSelected(label),
          barcode: label.barcode,
          round_label_top_line: '',
          round_label_bottom_line: ''
        }
      })
      return result
    },[])
  }
}

const createOntLabels = (selected) => {
  return {
    body: selected.reduce((result, label) => {
      result.push( {
        main_label: {
          pipeline: getPipeline().toUpperCase(),
          tube_barcode: label.tubeBarcode,
          date: moment().format('DD-MMM-YY'),
          name: label.name,
          round_label_top_line: '',
          round_label_bottom_line: ''
        }
      })
      return result
    },[])
  }
}

const getTextForSelected = (selected) => {
  if (selected.type == 'samples') { return selected.name}
  if (selected.type == 'libraries') { return selected.enzyme_name }
}

const printMyBarcodeRequest = () => {
  return store.getters.api.printMyBarcode.print_jobs
}

const postPrintJob = async (request, payload) => {
  let promise = request.create(payload)
  return await handlePromise(promise)
}

const getPipeline = () => {
  return localStorage.getItem('pipeline')
}

export {
  printJob,
  createPrintJobJson,
  createLabels,
  getTextForSelected,
  printMyBarcodeRequest,
  postPrintJob,
  getPipeline
}

export default printJob
