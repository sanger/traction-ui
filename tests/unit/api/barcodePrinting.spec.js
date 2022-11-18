import printJob from '@/api/barcodePrinting'

const request = vi.fn()

describe('barcodePrinting', () => {
  describe('printJob', () => {

    const printJobOptions = {
      labelTemplate: 'test_label_template',
      labels: [
        {
          barcode: 'TRAC-1',
          first_line: 'line 1',
          second_line: 'line 2',
          third_line: 'line 3',
          fourth_line: 'line 4',
          label_name: 'main_label'
        }
      ],
      copies: 1
    }

    it('successful', () => {
      
    })

    it('unsuccessful', () => {

    })

  })
})