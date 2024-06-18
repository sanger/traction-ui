import { createPinia, setActivePinia } from '@support/testHelper.js'
import { usePrintingStore } from '@/stores/printing.js'
import { beforeEach, describe, it } from 'vitest'
import useRootStore from '@/stores'
import * as jsonapi from '@/api/JsonApi'
import PrinterFactory from '@tests/factories/PrintersFactory.js'

const printersFactory = PrinterFactory()

describe('usePrintingStore', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should create the store', () => {
    const store = usePrintingStore()
    expect(store.resources.printers).toEqual({})
  })

  describe('getters', () => {
    describe('#printers', () => {
      it('should return printers', async () => {
        const store = usePrintingStore()
        store.resources.printers = printersFactory.storePrinters
        expect(store.printers()).toEqual(Object.values(store.resources.printers))
      })

      it('can return printers by laware type', async () => {
        const store = usePrintingStore()
        store.resources.printers = printersFactory.storePrinters
        expect(store.printers('tube').length).toEqual(4)
      })
    })
  })

  describe('actions', () => {
    // need to fix fetch API implementation
    describe('#fetchPrinters', () => {
      it('successful', async () => {
        //Mock useRootStore
        const rootStore = useRootStore()
        const get = vi.fn()

        get.mockResolvedValue(printersFactory.responses.fetch)
        rootStore.api.v2 = { traction: { printers: { get } } }

        const store = usePrintingStore()

        const { success } = await store.fetchPrinters()

        expect(store.resources.printers).toEqual(
          jsonapi.dataToObjectById({ ...printersFactory.content }),
        )
        expect(success).toBeTruthy()
        expect(get).toHaveBeenCalled()
      })

      it('unsuccessful', async () => {
        //Mock useRootStore
        const rootStore = useRootStore()
        const get = vi.fn()
        get.mockRejectedValue('Internal Server Error')
        rootStore.api.v2 = { traction: { printers: { get } } }

        const store = usePrintingStore()

        const { success } = await store.fetchPrinters()
        expect(store.resources.printers).toEqual({})
        expect(success).toBeFalsy()
      })
    })

    describe('#createPrintJob', () => {
      const printJobOptions = {
        printerName: 'my_printer',
        labelTemplateName: 'my_label_template',
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

        const mockResponse = {
          status: '201',
          statusText: 'OK',
          json: () => Promise.resolve({}),
          ok: true,
        }

        const rootStore = useRootStore()
        const create = vi.fn()
        rootStore.api.v2 = { printMyBarcode: { print_jobs: { create } } }
        create.mockResolvedValue(mockResponse)

        const { success, message } = await store.createPrintJob({ ...printJobOptions })

        const {
          printerName: printer_name,
          labelTemplateName: label_template_name,
          ...payload
        } = printJobOptions

        expect(create).toBeCalledWith({
          data: { ...payload, printer_name, label_template_name },
        })
        expect(success).toBeTruthy()
        expect(message).toEqual('Barcode(s) successfully printed')
      })

      it('unsuccessful', async () => {
        const store = usePrintingStore()
        const mockResponse = {
          status: '422',
          ok: false,
          json: () =>
            Promise.resolve({
              errors: [
                { source: { pointer: '/data/attributes/printer' }, detail: "can't be blank" },
              ],
            }),
        }

        const create = vi.fn()
        const rootStore = useRootStore()
        rootStore.api.v2 = { printMyBarcode: { print_jobs: { create } } }
        create.mockResolvedValue(mockResponse)

        // eslint-disable-next-line no-unused-vars
        const { _, ...rest } = printJobOptions

        const { success, message } = await store.createPrintJob({ ...rest })

        expect(success).toBeFalsy()
        // we are kind of retesting this but not sure what else to do
        expect(message).toEqual("printer can't be blank")
      })
    })
  })
})
