import actions from '@/store/printMyBarcode/actions'
import defaultState from '@/store/printMyBarcode/state'

describe('actions', () => {
  const { createPrintJob } = actions

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
