import * as PrintJobRequests from '@/api/PrintJobRequests'
import moment from 'moment'
import { store } from 'testHelper'
import Response from '@/api/Response'
import * as consts from '@/consts/consts'

describe('PrintJobRequests', () => {
  let selectedSamples, selectedLibraries, printerName

  beforeEach(() => {
    selectedSamples = [
      { id: 1, type: 'samples', name: 'sample1', barcode: 'TRAC-1' },
      { id: 2, type: 'samples', name: 'sample2', barcode: 'TRAC-2' },
    ]
    selectedLibraries = [
      { id: 1, type: 'libraries', enzyme_name: 'enz1', barcode: 'TRAC-1' },
      { id: 2, type: 'libraries', enzyme_name: 'enz2', barcode: 'TRAC-2' },
    ]
    printerName = 'printer1'
  })

  describe('printJob', () => {
    let request

    beforeEach(() => {
      localStorage.setItem('pipeline', consts.PIPELINE_SAPHYR)

      request = store.getters.api.printMyBarcode.print_jobs

      request.create = jest.fn()
    })

    it('returns a response on success', async () => {
      let mockResponse = {
        data: {},
        status: 201,
        statusText: 'Created',
      }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      request.create.mockResolvedValue(promise)
      let expected = new Response(mockResponse)

      let response = await PrintJobRequests.printJob(printerName, selectedSamples)
      expect(response).toEqual(expected)
    })

    it('returns a response on success for ont libraries', async () => {
      localStorage.setItem('pipeline', consts.PIPELINE_ONT)

      selectedLibraries = [
        { id: 1, type: 'libraries', name: 'DEMO-PLATE-1-1', tubeBarcode: 'TRAC-2-20' },
        { id: 2, type: 'libraries', name: 'DEMO-PLATE-2-1', tubeBarcode: 'TRAC-2-21' },
      ]

      let mockResponse = {
        data: {},
        status: 201,
        statusText: 'Created',
      }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      request.create.mockResolvedValue(promise)
      let expected = new Response(mockResponse)

      let response = await PrintJobRequests.printJob(printerName, selectedLibraries)
      expect(response).toEqual(expected)
    })

    it('returns a response on failure', async () => {
      let mockResponse = {
        data: {
          errors: {
            it: ['was a bust'],
          },
        },
        status: 422,
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
    it('return JSON for saphyr pipeline', async () => {
      localStorage.setItem('pipeline', consts.PIPELINE_SAPHYR)

      let resp = PrintJobRequests.createPrintJobJson(printerName, selectedSamples)
      let labels = PrintJobRequests.createLabels(selectedSamples)
      let expected = {
        data: {
          attributes: {
            printer_name: printerName,
            label_template_id: process.env.VUE_APP_SAPHYR_LABEL_TEMPLATE_ID,
            labels: labels,
          },
        },
      }
      expect(resp).toEqual(expected)
    })

    it('return JSON for pacbio pipeline', async () => {
      localStorage.setItem('pipeline', consts.PIPELINE_PACBIO)

      let resp = PrintJobRequests.createPrintJobJson(printerName, selectedSamples)
      let labels = PrintJobRequests.createLabels(selectedSamples)
      let expected = {
        data: {
          attributes: {
            printer_name: printerName,
            label_template_id: process.env.VUE_APP_PACBIO_LABEL_TEMPLATE_ID,
            labels: labels,
          },
        },
      }
      expect(resp).toEqual(expected)
    })
  })

  describe('createLabels', () => {
    describe('saphyr', () => {
      beforeEach(() => {
        localStorage.setItem('pipeline', consts.PIPELINE_SAPHYR)
      })

      it('returns JSON for saphyr samples', async () => {
        let resp = PrintJobRequests.createLabels(selectedSamples)
        let expectedLabel1 = resp.body[0].main_label
        let expectedLabel2 = resp.body[1].main_label

        expect(expectedLabel1.barcode).toEqual('TRAC-1')
        expect(expectedLabel1.barcode_text).toEqual('TRAC-1')
        expect(expectedLabel1.date).toEqual(moment().format('DD-MMM-YY'))
        expect(expectedLabel1.pipeline).toEqual(consts.PIPELINE_SAPHYR.toUpperCase())
        expect(expectedLabel1.text_1).toEqual('sample1')
        expect(expectedLabel1.round_label_top_line).toEqual('')
        expect(expectedLabel1.round_label_bottom_line).toEqual('')
        expect(expectedLabel2.barcode).toEqual('TRAC-2')
        expect(expectedLabel2.barcode_text).toEqual('TRAC-2')
        expect(expectedLabel2.date).toEqual(moment().format('DD-MMM-YY'))
        expect(expectedLabel2.pipeline).toEqual(consts.PIPELINE_SAPHYR.toUpperCase())
        expect(expectedLabel2.text_1).toEqual('sample2')
        expect(expectedLabel2.round_label_top_line).toEqual('')
        expect(expectedLabel2.round_label_bottom_line).toEqual('')
      })

      it('returns JSON for saphyr libraries', async () => {
        let resp = PrintJobRequests.createLabels(selectedLibraries)
        let expectedLabel1 = resp.body[0].main_label
        let expectedLabel2 = resp.body[1].main_label

        expect(expectedLabel1.barcode).toEqual('TRAC-1')
        expect(expectedLabel1.barcode_text).toEqual('TRAC-1')
        expect(expectedLabel1.date).toEqual(moment().format('DD-MMM-YY'))
        expect(expectedLabel1.pipeline).toEqual(consts.PIPELINE_SAPHYR.toUpperCase())
        expect(expectedLabel1.text_1).toEqual('enz1')
        expect(expectedLabel1.round_label_top_line).toEqual('')
        expect(expectedLabel1.round_label_bottom_line).toEqual('')
        expect(expectedLabel2.barcode).toEqual('TRAC-2')
        expect(expectedLabel2.barcode_text).toEqual('TRAC-2')
        expect(expectedLabel2.date).toEqual(moment().format('DD-MMM-YY'))
        expect(expectedLabel2.pipeline).toEqual(consts.PIPELINE_SAPHYR.toUpperCase())
        expect(expectedLabel2.text_1).toEqual('enz2')
        expect(expectedLabel2.round_label_top_line).toEqual('')
        expect(expectedLabel2.round_label_bottom_line).toEqual('')
      })
    })

    describe('pacbio', () => {
      beforeEach(() => {
        localStorage.setItem('pipeline', consts.PIPELINE_PACBIO)
      })

      it('returns JSON for pacbio samples', async () => {
        let resp = PrintJobRequests.createLabels(selectedSamples)
        let expectedLabel1 = resp.body[0].main_label
        let expectedLabel2 = resp.body[1].main_label

        expect(expectedLabel1.barcode).toEqual('TRAC-1')
        expect(expectedLabel1.barcode_text).toEqual('TRAC-1')
        expect(expectedLabel1.date).toEqual(moment().format('DD-MMM-YY'))
        expect(expectedLabel1.pipeline).toEqual(consts.PIPELINE_PACBIO.toUpperCase())
        expect(expectedLabel1.text_1).toEqual('sample1')
        expect(expectedLabel1.round_label_top_line).toEqual('')
        expect(expectedLabel1.round_label_bottom_line).toEqual('')
        expect(expectedLabel2.barcode).toEqual('TRAC-2')
        expect(expectedLabel2.barcode_text).toEqual('TRAC-2')
        expect(expectedLabel2.date).toEqual(moment().format('DD-MMM-YY'))
        expect(expectedLabel2.pipeline).toEqual(consts.PIPELINE_PACBIO.toUpperCase())
        expect(expectedLabel2.text_1).toEqual('sample2')
        expect(expectedLabel2.round_label_top_line).toEqual('')
        expect(expectedLabel2.round_label_bottom_line).toEqual('')
      })

      it('returns JSON for pacbio libraries', async () => {
        let resp = PrintJobRequests.createLabels(selectedLibraries)
        let expectedLabel1 = resp.body[0].main_label
        let expectedLabel2 = resp.body[1].main_label

        expect(expectedLabel1.barcode).toEqual('TRAC-1')
        expect(expectedLabel1.barcode_text).toEqual('TRAC-1')
        expect(expectedLabel1.date).toEqual(moment().format('DD-MMM-YY'))
        expect(expectedLabel1.pipeline).toEqual(consts.PIPELINE_PACBIO.toUpperCase())
        expect(expectedLabel1.text_1).toEqual('enz1')
        expect(expectedLabel1.round_label_top_line).toEqual('')
        expect(expectedLabel1.round_label_bottom_line).toEqual('')
        expect(expectedLabel2.barcode).toEqual('TRAC-2')
        expect(expectedLabel2.barcode_text).toEqual('TRAC-2')
        expect(expectedLabel2.date).toEqual(moment().format('DD-MMM-YY'))
        expect(expectedLabel2.pipeline).toEqual(consts.PIPELINE_PACBIO.toUpperCase())
        expect(expectedLabel2.text_1).toEqual('enz2')
        expect(expectedLabel2.round_label_top_line).toEqual('')
        expect(expectedLabel2.round_label_bottom_line).toEqual('')
      })
    })
  })

  describe('getTextForSelected', () => {
    it('returns the correct text for sample', async () => {
      let text = PrintJobRequests.getTextForSelected(selectedSamples[0])
      let expected = 'sample1'
      expect(text).toEqual(expected)
    })

    it('returns the correct text for library', async () => {
      let text = PrintJobRequests.getTextForSelected(selectedLibraries[0])
      let expected = 'enz1'
      expect(text).toEqual(expected)
    })
  })

  describe('printMyBarcodeRequest', () => {
    it('returns a pmb request', () => {
      let request = PrintJobRequests.printMyBarcodeRequest()
      expect(request.baseURL).toEqual(process.env.VUE_APP_PRINTMYBARCODE_BASE_URL)
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
      let mockResponse = {
        data: {},
        status: 201,
        statusText: 'OK',
      }

      let promise = new Promise((resolve) => {
        resolve(mockResponse)
      })

      request.create.mockResolvedValue(promise)

      let response = await PrintJobRequests.postPrintJob(request, payload)
      expect(response.successful).toBeTruthy()
    })

    it('unsuccessfully', async () => {
      let mockResponse = {
        data: {
          errors: {
            it: ['was a bust'],
          },
        },
        status: 422,
      }

      let promise = new Promise((reject) => {
        reject(mockResponse)
      })

      request.create.mockReturnValue(promise)
      let response = await PrintJobRequests.postPrintJob(request, payload)
      expect(response.successful).toBeFalsy()
    })
  })

  describe('getPipeline', () => {
    beforeEach(() => {
      localStorage.setItem('pipeline', consts.PIPELINE_PACBIO)
    })

    it('returns the pipeline in local storage', () => {
      let result = PrintJobRequests.getPipeline()
      expect(result).toEqual(consts.PIPELINE_PACBIO)
    })
  })
})
