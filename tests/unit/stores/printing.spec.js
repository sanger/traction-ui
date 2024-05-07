import { createPinia, setActivePinia } from '@support/testHelper.js'
import { usePrintingStore } from '@/stores/printing.js'
import { beforeEach, describe, it } from 'vitest'
import useRootStore from '@/stores'
import * as jsonapi from '@/api/JsonApi'
import fs from 'fs'
import { join } from 'path'

const ResponseFactory = async (name, axios = true) => {
  const filePath = join(__dirname, '../../data', `${name}.json`)

  let response = {}

  try {
    const fileContent = await fs.readFileSync(filePath, 'utf8')
    response = JSON.parse(fileContent)
  } catch (err) {
    console.error(err)
  }

  if (axios) {
    return {
      status: 200,
      statusText: 'OK',
      data: { ...response.data },
    }
  } else {
    return {
      status: 200,
      statusText: 'OK',
      json: () => Promise.resolve(response.data),
      ok: true,
    }
  }
}

describe('usePrintingStore', () => {
  beforeEach(() => {
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  it('should create the store', () => {
    const store = usePrintingStore()
    expect(store.resources.printers).toEqual({})
  })

  describe('actions', () => {
    // need to fix fetch API implementation
    describe('#fetchPrinters', () => {
      it('successful', async () => {
        //Mock useRootStore
        const rootStore = useRootStore()
        const get = vi.fn()
        const printers = await ResponseFactory('Printers', false)

        get.mockResolvedValue(printers)
        rootStore.api = { traction: { printers: { get } } }

        const store = usePrintingStore()

        const { success } = await store.fetchPrinters()

        expect(store.resources.printers).toEqual(jsonapi.dataToObjectById({ ...printers }))
        expect(success).toBeTruthy()
        expect(get).toHaveBeenCalled()
      })

      it('unsuccessful', async () => {
        //Mock useRootStore
        const rootStore = useRootStore()
        const get = vi.fn()
        get.mockRejectedValue('Internal Server Error')
        rootStore.api = { traction: { printers: { get } } }

        const store = usePrintingStore()

        const { success } = await store.fetchPrinters()
        expect(store.resources.printers).toEqual({})
        expect(success).toBeFalsy()
      })
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
})
