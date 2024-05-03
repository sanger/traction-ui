import { createPinia, setActivePinia } from '@support/testHelper.js'
import { usePrintingStore } from '@/stores/printing.js'
import { beforeEach, describe } from 'vitest'

describe('usePrintingStore', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should create the store', () => {
    const store = usePrintingStore()
    expect(store.printers).toEqual([])
  })

  describe.skip('#createPrintJob', () => {
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
      const store = usePrintingStore()
      const create = vi.fn()
      //const rootState = { api: { printMyBarcode: { print_jobs: { create } } } }
      const tubeLabelTemplateName = 'tube_label_template'
      const mockResponse = {
        status: '201',
      }

      create.mockResolvedValue(mockResponse)

      const { success, message } = await store.createPrintJob({ ...printJobOptions })

      const { printerName: printer_name, ...payload } = printJobOptions

      expect(create).toBeCalledWith({
        data: { ...payload, printer_name, label_template_name: tubeLabelTemplateName },
      })
      expect(success).toBeTruthy()
      expect(message).toEqual('Barcode(s) successfully printed')
    })

    it('unsuccessful', async () => {
      const store = usePrintingStore()
      const create = vi.fn()
      // const rootState = { api: { printMyBarcode: { print_jobs: { create } } } }
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

      const { success, message } = await store.createPrintJob({ ...rest })

      expect(success).toBeFalsy()
      // looks like there is an issue with the errors again. How many times do we have to fix this.
      expect(message).toEqual("/data/attributes/printer can't be blank")
    })
  })
})
