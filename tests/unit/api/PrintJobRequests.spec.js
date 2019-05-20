import * as PrintJobRequests from '@/api/PrintJobRequests'
import moment from 'moment'
import { store } from '../testHelper'
import Response from '@/api/Response'

describe('PrintJobRequests', () => {
  let selectedSamples, selectedLibraries, printerName

  beforeEach(() => {
    selectedSamples = [
      { id: 1, type: 'samples', name: 'sample1', barcode: 'TRAC-1' },
      { id: 2, type: 'samples', name: 'sample2', barcode: 'TRAC-2' }
    ]
    selectedLibraries = [
      { id: 1, type: 'libraries', enzyme_name: 'enz1', barcode: 'TRAC-1' },
      { id: 2, type: 'libraries', enzyme_name: 'enz2', barcode: 'TRAC-2' }
    ]
    printerName = 'printer1'
  })

  describe('printJob', () => {
    let request

    beforeEach(() => {
      request = store.getters.api.printMyBarcode.print_jobs
      request.create = jest.fn()
    })

    it('returns a response on success', async () => {
      let mockResponse =  {
        data: {},
        status: 201,
        statusText: "Created"
      }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      request.create.mockResolvedValue(promise)
      let expected = new Response(mockResponse)

      let response = await PrintJobRequests.printJob(printerName, selectedSamples)
      expect(response).toEqual(expected)
    })

    it('returns a response on failure', async () => {
      let mockResponse =  {
        data: {
          errors: {
            it: ['was a bust']
          }
        },
        status: 422
      }

      let promise = new Promise((reject) => {
        reject(mockResponse)
      })

      request.create.mockReturnValue(promise)
      let expected = new Response(mockResponse)

      let response = await PrintJobRequests.printJob(printerName, selectedSamples)
      expect(response).toEqual(expected)
    })

  })

  describe('createPrintJobJson', () => {

    it('return json', async () => {
      let labelTemplateId = "1"
      let resp = PrintJobRequests.createPrintJobJson(printerName, selectedSamples)
      let labels = PrintJobRequests.createLabels(selectedSamples)
      let expected = { data: { attributes: { printer_name: printerName, label_template_id: labelTemplateId, labels: labels } } }
      expect(resp).toEqual(expected)
    })

  })

  describe('createLabels', () => {

    it('return json for samples', async () => {
      let resp = PrintJobRequests.createLabels(selectedSamples)
      let expectedLabel1 = resp.body[0].main_label
      let expectedLabel2 = resp.body[1].main_label

      expect(expectedLabel1.barcode).toEqual("TRAC-1")
      expect(expectedLabel1.barcode_text).toEqual("TRAC-1")
      expect(expectedLabel1.date).toEqual(moment().format('MMMM Do YYYY'))
      expect(expectedLabel1.pipeline).toEqual("SAPHYR")
      expect(expectedLabel1.text_1).toEqual("sample1")
      expect(expectedLabel1.round_label_top_line).toEqual("")
      expect(expectedLabel1.round_label_bottom_line).toEqual("")
      expect(expectedLabel2.barcode).toEqual("TRAC-2")
      expect(expectedLabel2.barcode_text).toEqual("TRAC-2")
      expect(expectedLabel2.date).toEqual(moment().format('MMMM Do YYYY'))
      expect(expectedLabel2.pipeline).toEqual("SAPHYR")
      expect(expectedLabel2.text_1).toEqual("sample2")
      expect(expectedLabel2.round_label_top_line).toEqual("")
      expect(expectedLabel2.round_label_bottom_line).toEqual("")
    })

    it('return json for libraries', async () => {
      let resp = PrintJobRequests.createLabels(selectedLibraries)
      let expectedLabel1 = resp.body[0].main_label
      let expectedLabel2 = resp.body[1].main_label

      expect(expectedLabel1.barcode).toEqual("TRAC-1")
      expect(expectedLabel1.barcode_text).toEqual("TRAC-1")
      expect(expectedLabel1.date).toEqual(moment().format('MMMM Do YYYY'))
      expect(expectedLabel1.pipeline).toEqual("SAPHYR")
      expect(expectedLabel1.text_1).toEqual("enz1")
      expect(expectedLabel1.round_label_top_line).toEqual("")
      expect(expectedLabel1.round_label_bottom_line).toEqual("")
      expect(expectedLabel2.barcode).toEqual("TRAC-2")
      expect(expectedLabel2.barcode_text).toEqual("TRAC-2")
      expect(expectedLabel2.date).toEqual(moment().format('MMMM Do YYYY'))
      expect(expectedLabel2.pipeline).toEqual("SAPHYR")
      expect(expectedLabel2.text_1).toEqual("enz2")
      expect(expectedLabel2.round_label_top_line).toEqual("")
      expect(expectedLabel2.round_label_bottom_line).toEqual("")
    })

  })

  describe('getTextForSelected', () => {

    it('returns the correct text for sample', async () => {
      let text = PrintJobRequests.getTextForSelected(selectedSamples[0])
      let expected = 'sample1'
      expect(text).toEqual(expected)
    })

    it('returns the correct text for sample', async () => {
      let text = PrintJobRequests.getTextForSelected(selectedLibraries[0])
      let expected = 'enz1'
      expect(text).toEqual(expected)
    })
  })

  describe('printMyBarcodeRequest', () => {
    it ('returns a pmb request', () => {
      let request = PrintJobRequests.printMyBarcodeRequest()
      expect(request.baseURL).toEqual('http://printmybarcode')
      expect(request.apiNamespace).toEqual('v1')
    })
  })

  describe('postPrintJob', () => {
    let request, payload

    beforeEach(() => {
      request = store.getters.api.printMyBarcode.print_jobs
      payload = PrintJobRequests.createPrintJobJson(printerName, selectedSamples)
      request.create = jest.fn()
    })

    it('successfully posts a print job request', async () => {
      let mockResponse =  {
        data: {},
        status: 201,
        statusText: "OK"
      }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      request.create.mockResolvedValue(promise)

      let response = await PrintJobRequests.postPrintJob(request, payload)
      expect(response.successful).toBeTruthy()
    })

    it('unsuccessfully', async () => {
      let mockResponse =  {
        data: {
          errors: {
            it: ['was a bust']
          }
        },
        status: 422
      }

      let promise = new Promise((reject) => {
        reject(mockResponse)
      })

      request.create.mockReturnValue(promise)
      let response = await PrintJobRequests.postPrintJob(request, payload)
      expect(response.successful).toBeFalsy()
    })

  })
})
