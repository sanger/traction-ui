import actions from '@/store/printMyBarcode/actions'
import { newResponse } from '@/api/ResponseHelper'
import defaultState from '@/store/printMyBarcode/state'

const formatDate = () => {
  const [, mmm, dd, yyyy] = new Date().toDateString().split(' ')
  return `${dd}-${mmm}-${yyyy.slice(2)}`
}

const getSuffix = (suffix, barcode) => {
  return suffix ? barcode.slice(barcode.lastIndexOf('-') + 1) : ''
}

const trimBarcode = (suffix, barcode) => {
  return suffix ? barcode.slice(0, barcode.lastIndexOf('-')) : barcode
}

describe('actions', () => {
  const { printJob, createPrintJobJson, createPrintJob } = actions

  let printerName, barcodesList, copies, tubeLabelTemplateName, printJobJson, suffix

  beforeEach(() => {
    printerName = 'aPrinterName'
    barcodesList = ['aBarcode-UPPA1', 'aBarcode-UPPA2']
    copies = '2'
    tubeLabelTemplateName = 'traction_tube_label_template'
    suffix = 'UPPA'

    printJobJson = {
      print_job: {
        printer_name: printerName,
        label_template_name: 'traction_tube_label_template',
        labels: [
          {
            first_line: formatDate(),
            second_line: trimBarcode(suffix, barcodesList[0]),
            third_line: getSuffix(suffix, barcodesList[0]),
            barcode: barcodesList[0],
            label_name: 'main_label',
          },
          {
            first_line: formatDate(),
            second_line: trimBarcode(suffix, barcodesList[1]),
            third_line: getSuffix(suffix, barcodesList[1]),
            barcode: barcodesList[1],
            label_name: 'main_label',
          },
        ],
        copies: copies,
      },
    }
  })

  describe('#printJob', () => {
    let params, create, getters

    beforeEach(() => {
      create = vi.fn()

      getters = {
        printJobRequest: { create },
        tubeLabelTemplateName: tubeLabelTemplateName,
      }

      params = {
        printerName,
        barcodesList,
        copies: copies,
        suffix,
      }
    })

    it('successfully', async () => {
      create.mockReturnValue({})

      const expectedResponse = newResponse({
        success: true,
      })

      const response = await printJob({ getters }, params)

      expect(create).toHaveBeenCalledWith({ data: printJobJson })
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

      const response = await printJob({ getters }, params)

      expect(create).toHaveBeenCalledWith({ data: printJobJson })
      expect(response).toEqual(expectedResponse)
    })

    it('unsuccessfully empty data', async () => {
      const emptyResponse = { success: false, data: { errors: [] } }

      create.mockReturnValue(emptyResponse)
      const response = await printJob({ getters }, params)

      const expectedResponse = {
        success: false,
        data: {
          message: 'Unknown',
        },
      }

      expect(create).toHaveBeenCalledWith({ data: printJobJson })
      expect(response).toEqual(expectedResponse)
    })
  })

  describe('#printJobJson', () => {
    it('returns the correct json', () => {
      const params = {
        printerName,
        barcodesList,
        copies,
        suffix,
      }

      const result = createPrintJobJson(params, tubeLabelTemplateName)
      expect(result).toEqual(printJobJson)
    })
  })

  describe('#createPrintJob', () => {
    const printJobOptions = {
      printerName: 'my_printer',
      labels: [
        {
          barcode: 'TRAC-1',
          first_line: 'line 1',
          second_line: 'line 2',
          third_line: 'line 3',
          fourth_line: 'line 4',
          label_name: 'main_label',
        },
      ],
      copies: 1,
    }

    it('successful', async () => {
      const create = vi.fn()
      const rootState = { api: { printMyBarcode: { print_jobs: { create } } } }
      const mockResponse = {
        status: '201',
      }

      create.mockResolvedValue(mockResponse)

      const { success, message } = await createPrintJob(
        { rootState, state: defaultState },
        { ...printJobOptions },
      )

      const { printerName: printer_name, ...payload } = printJobOptions

      expect(create).toBeCalledWith({
        data: { ...payload, printer_name, label_template_name: defaultState.tubeLabelTemplateName },
      })
      expect(success).toBeTruthy()
      expect(message).toEqual('Barcode(s) successfully printed')
    })

    //TODO: Check errors are correct
    it('unsuccessful', async () => {
      const create = vi.fn()
      const rootState = { api: { printMyBarcode: { print_jobs: { create } } } }
      const mockResponse = {
        status: '422',
        response: {
          data: {
            errors: [
              {
                source: {
                  pointer: '/data/attributes/printer',
                },
                detail: "can't be blank",
              },
            ],
          },
        },
      }

      create.mockRejectedValue(mockResponse)

      // eslint-disable-next-line no-unused-vars
      const { _, ...rest } = printJobOptions

      const { success, message } = await createPrintJob(
        { rootState, state: defaultState },
        { ...rest },
      )

      expect(success).toBeFalsy()
      // looks like there is an issue with the errors again. How many times do we have to fix this.
      expect(message).toEqual("/data/attributes/printer can't be blank")
    })
  })
})
