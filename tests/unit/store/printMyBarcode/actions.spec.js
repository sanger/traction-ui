import * as Actions from '@/store/printMyBarcode/actions'
import { newResponse } from '@/api/ResponseHelper'

describe('actions', () => {
  let printerName, barcodesList, copies, tubeLabelTemplateName, createPrintJobJsonV2

  beforeEach(() => {
    printerName = 'aPrinterName'
    barcodesList = ['aBarcode-A1', 'aBarcode-A2']
    copies = '2'
    tubeLabelTemplateName = 'traction_tube_label_template_v2'

    createPrintJobJsonV2 = {
      print_job: {
        printer_name: printerName,
        label_template_name: 'traction_tube_label_template_v2',
        labels: [
          {
            first_line: 'DATE',
            second_line: barcodesList[0],
            third_line: 'third line',
            barcode: barcodesList[0],
            label_name: 'main_label',
          },
          {
            first_line: 'DATE',
            second_line: barcodesList[1],
            third_line: 'third line',
            barcode: barcodesList[1],
            label_name: 'main_label',
          },
        ],
        copies: copies,
      },
    }
  })

  describe('#printJobV2', () => {
    let params, create, getters

    beforeEach(() => {
      create = jest.fn()

      getters = {
        printJobV2Request: { create: create },
        tubeLabelTemplateName: tubeLabelTemplateName,
      }

      params = {
        printer: {
          text: printerName,
          type: 'squix',
        },
        barcodesList: barcodesList,
        copies: copies,
      }
    })

    it('successfully', async () => {
      create.mockReturnValue({})

      const expectedResponse = newResponse({
        success: true,
      })

      let response = await Actions.printJobV2({ getters }, params)

      expect(create).toHaveBeenCalledWith({ data: createPrintJobJsonV2 })
      expect(response).toEqual(expectedResponse)
    })

    it('unsuccessfully failed', async () => {
      let failedResponse = {
        success: false,
        data: {
          errors: [{ source: { pointer: 'api/labels' }, detail: 'failed' }],
        },
      }
      create.mockReturnValue(failedResponse)

      const expectedResponse = {
        success: false,
        errors: 'api/labels failed',
      }

      let response = await Actions.printJobV2({ getters }, params)

      expect(create).toHaveBeenCalledWith({ data: createPrintJobJsonV2 })
      expect(response).toEqual(expectedResponse)
    })

    it('unsuccessfully empty data', async () => {
      let emptyResponse = { success: false, data: { errors: [] } }

      create.mockReturnValue(emptyResponse)
      let response = await Actions.printJobV2({ getters }, params)

      const expectedResponse = {
        success: false,
        errors: '',
        data: {
          errors: [],
        },
      }

      expect(create).toHaveBeenCalledWith({ data: createPrintJobJsonV2 })
      expect(response).toEqual(expectedResponse)
    })
  })

  describe('#createPrintJobJsonV2', () => {
    it('returns the correct json', () => {
      let result = Actions.createPrintJobJsonV2(
        printerName,
        barcodesList,
        copies,
        tubeLabelTemplateName,
      )
      expect(result).toEqual(createPrintJobJsonV2)
    })
  })
})
