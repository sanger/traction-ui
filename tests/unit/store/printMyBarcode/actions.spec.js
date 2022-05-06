import * as Actions from '@/store/printMyBarcode/actions'
import { newResponse } from '@/api/ResponseHelper'

describe('#printJobV2', () => {
  let expectedPayload,
    params,
    create,
    getters,
    printerName,
    barcodesList,
    copies,
    labelTemplateName,
    failedResponse,
    emptyResponse

  beforeEach(() => {
    printerName = 'aPrinterName'
    barcodesList = ['aBarcode-A1', 'aBarcode-A2']
    copies = '2'
    labelTemplateName = 'aLabelTemplateName'

    params = {
      printer: {
        text: printerName,
      },
      barcodesList: barcodesList,
      copies: copies,
      labelTemplateName: labelTemplateName,
    }
    create = jest.fn()
    getters = { printJobV2Request: { create: create } }

    failedResponse = {
      success: false,
      data: {
        errors: [{ source: { pointer: 'api/labels' }, detail: 'failed' }],
      },
    }

    emptyResponse = { success: false, data: { errors: [] } }

    expectedPayload = {
      print_job: {
        printer_name: printerName,
        label_template_name: 'x',
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

  it('successfully', async () => {
    create.mockReturnValue({})

    const expectedResponse = newResponse({
      success: true,
    })

    let response = await Actions.printJobV2({ getters }, params)

    expect(create).toHaveBeenCalledWith({ data: expectedPayload })
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully failed', async () => {
    create.mockReturnValue(failedResponse)

    const expectedResponse = {
      success: false,
      errors: 'api/labels failed',
    }

    let response = await Actions.printJobV2({ getters }, params)

    expect(create).toHaveBeenCalledWith({ data: expectedPayload })
    expect(response).toEqual(expectedResponse)
  })

  it('unsuccessfully empty data', async () => {
    create.mockReturnValue(emptyResponse)
    let response = await Actions.printJobV2({ getters }, params)

    const expectedResponse = {
      success: false,
      errors: '',
      data: {
        errors: [],
      },
    }

    expect(create).toHaveBeenCalledWith({ data: expectedPayload })
    expect(response).toEqual(expectedResponse)
  })
})

describe('#createPrintJobJsonV2', () => {
  let printerName, barcodesList, copies, labelTemplateName

  beforeEach(() => {
    printerName = 'aPrinterName'
    barcodesList = ['aBarcode-A1', 'aBarcode-A2']
    copies = '2'
    labelTemplateName = 'aLabelTemplateName'
  })

  it('returns the correct json', () => {
    let expected = {
      print_job: {
        printer_name: printerName,
        label_template_name: labelTemplateName,
        labels: [
          {
            first_line: 'DATE',
            second_line: 'aBarcode-A1',
            third_line: 'third line',
            barcode: 'aBarcode-A1',
            label_name: 'main_label',
          },
          {
            first_line: 'DATE',
            second_line: 'aBarcode-A2',
            third_line: 'third line',
            barcode: 'aBarcode-A2',
            label_name: 'main_label',
          },
        ],
        copies: copies,
      },
    }

    let result = Actions.createPrintJobJsonV2(printerName, barcodesList, copies, labelTemplateName)
    expect(result).toEqual(expected)
  })
})
