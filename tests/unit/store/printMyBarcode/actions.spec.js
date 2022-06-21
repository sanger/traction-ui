import * as Actions from '@/store/printMyBarcode/actions'
import { newResponse } from '@/api/ResponseHelper'

const formatDate = () => {
  const [, mmm, dd, yyyy] = new Date().toDateString().split(' ')
  return `${dd}-${mmm}-${yyyy.slice(2)}`
}

describe('actions', () => {
  let printerName, barcodesList, copies, tubeLabelTemplateName, createPrintJobJsonV2

  beforeEach(() => {
    printerName = 'aPrinterName'
    barcodesList = ['aBarcode-A1', 'aBarcode-A2']
    copies = '2'
    tubeLabelTemplateName = 'traction_tube_label_template'

    createPrintJobJsonV2 = {
      print_job: {
        printer_name: printerName,
        label_template_name: 'traction_tube_label_template',
        labels: [
          {
            first_line: formatDate(),
            second_line: barcodesList[0],
            third_line: '',
            barcode: barcodesList[0],
            label_name: 'main_label',
          },
          {
            first_line: formatDate(),
            second_line: barcodesList[1],
            third_line: '',
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
        printerName: printerName,
        barcodesList: barcodesList,
        copies: copies,
      }
    })

    it('successfully', async () => {
      create.mockReturnValue({})

      const expectedResponse = newResponse({
        success: true,
      })

      const response = await Actions.printJobV2({ getters }, params)

      expect(create).toHaveBeenCalledWith({ data: createPrintJobJsonV2 })
      expect(response).toEqual(expectedResponse)
    })

    it('unsuccessfully failed', async () => {
      const failedResponse = {
        success: false,
        data: {
          errors: [{ source: { pointer: 'api/labels' }, detail: 'failed' }],
        },
      }
      create.mockReturnValue(failedResponse)

      const expectedResponse = {
        success: false,
        data: {
          message: 'api/labels failed',
        },
      }

      const response = await Actions.printJobV2({ getters }, params)

      expect(create).toHaveBeenCalledWith({ data: createPrintJobJsonV2 })
      expect(response).toEqual(expectedResponse)
    })

    it('unsuccessfully empty data', async () => {
      const emptyResponse = { success: false, data: { errors: [] } }

      create.mockReturnValue(emptyResponse)
      const response = await Actions.printJobV2({ getters }, params)

      const expectedResponse = {
        success: false,
        data: {
          message: 'Unknown',
        },
      }

      expect(create).toHaveBeenCalledWith({ data: createPrintJobJsonV2 })
      expect(response).toEqual(expectedResponse)
    })
  })

  describe('#createPrintJobJsonV2', () => {
    it('returns the correct json', () => {
      const params = {
        printerName: printerName,
        barcodesList: barcodesList,
        copies: copies,
      }

      const result = Actions.createPrintJobJsonV2(params, tubeLabelTemplateName)
      expect(result).toEqual(createPrintJobJsonV2)
    })
  })
})
