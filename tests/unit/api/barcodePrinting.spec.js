import printJob from '@/api/barcodePrinting'
import { expect } from 'vitest'

const request = { create: vi.fn() }

describe('barcodePrinting', () => {
  describe('printJob', () => {
    const printJobOptions = {
      printerName: 'my_printer',
      labelTemplate: 'test_label_template',
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

    // TODO: Check payload
    it('successful', async () => {
      const message = 'Barcodes successfully printed'
      const mockResponse = {
        status: '201',
        data: { message },
      }

      request.create.mockResolvedValue(mockResponse)

      const { success, data } = await printJob({ ...printJobOptions, request })

      expect(success).toBeTruthy()
      expect(data).toEqual({ message })
    })

    //TODO: Check errors are correct
    it('unsuccessful', async () => {
      const mockResponse = {
        status: '422',
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
      }

      request.create.mockRejectedValue(mockResponse)

      // eslint-disable-next-line no-unused-vars
      const { _, ...rest } = printJobOptions

      const { success, errors } = await printJob({ ...rest, request })

      expect(success).toBeFalsy()
      expect(errors).toBeDefined()
    })
  })
})
