import LabelPrintingForm from '@/components/labelPrinting/LabelPrintingForm'
import SuffixList from '@/config/SuffixList'
import { localVue, mount, store } from '@support/testHelper'

describe('LabelPrintingForm.vue', () => {
  let wrapper, labelPrintingForm

  beforeEach(() => {
    wrapper = mount(LabelPrintingForm, {
      localVue,
      store,
      propsData: {},
    })
    labelPrintingForm = wrapper.vm
  })

  it('will have an reset button', () => {
    expect(wrapper.find('#reset-button').exists()).toBeTruthy()
  })

  describe('data', () => {
    it('has a form with a barcode', () => {
      wrapper.setData({ form: { barcode: 'aBarcode' } })
      expect(labelPrintingForm.form.barcode).toBe('aBarcode')
    })
    it('has a form with selectedSuffix', () => {
      wrapper.setData({ form: { selectedSuffix: 'ESHR' } })
      expect(labelPrintingForm.form.selectedSuffix).toBe('ESHR')
    })
    it('has a form with a selectedNumberOfLabels', () => {
      wrapper.setData({ form: { selectedNumberOfLabels: '2' } })
      expect(labelPrintingForm.form.selectedNumberOfLabels).toBe('2')
    })
    it('has a form with a selectedPrinterName', () => {
      wrapper.setData({ form: { selectedPrinterName: 'stub' } })
      expect(labelPrintingForm.form.selectedPrinterName).toBe('stub')
    })
    it('has a form with copies', () => {
      wrapper.setData({ form: { copies: '1' } })
      expect(labelPrintingForm.form.copies).toBe('1')
    })
  })

  describe('methods', () => {
    it('setSuffixOptions ', async () => {
      expect(labelPrintingForm.suffixOptions.length - 1).toEqual(SuffixList.length)
    })

    it('setPrinterNames ', async () => {
      expect(labelPrintingForm.printerOptions.length).toEqual(store.getters.printers.length)
    })

    describe('suffixedBarcodes', () => {
      it('created the list of suffixed barcodes when all form data is present', () => {
        wrapper.setData({
          form: {
            barcode: 'aBarcode',
            selectedSuffix: 'ESHR',
            selectedNumberOfLabels: 2,
          },
        })
        expect(labelPrintingForm.suffixedBarcodes()).toEqual(['aBarcode-ESHR1', 'aBarcode-ESHR2'])
      })
      it('returns an empty list when barcode is not present', () => {
        wrapper.setData({
          form: { selectedSuffix: 'ESHR', selectedNumberOfLabels: 2 },
        })
        expect(labelPrintingForm.suffixedBarcodes()).toEqual([])
      })
      it('returns an empty list when selectedNumberOfLabels is not present', () => {
        wrapper.setData({
          form: { selectedSuffix: 'ESHR', barcode: 'aBarcide' },
        })
        expect(labelPrintingForm.suffixedBarcodes()).toEqual([])
      })
      it('returns an empty list when selectedSuffix is not present', () => {
        wrapper.setData({
          form: { barcode: 'aBarcode', selectedNumberOfLabels: 2 },
        })
        expect(labelPrintingForm.suffixedBarcodes()).toEqual([])
      })
      it('created the list of selectedNumberOfLabels is greater than 9', () => {
        wrapper.setData({
          form: {
            barcode: 'aBarcode',
            selectedSuffix: 'ESHR',
            selectedNumberOfLabels: 10,
          },
        })
        expect(labelPrintingForm.suffixedBarcodes()).toEqual([])
      })
    })

    describe('printer', () => {
      it('gets the printer', () => {
        wrapper.setData({ form: { selectedPrinterName: 'stub' } })
        expect(labelPrintingForm.printerName()).toEqual(labelPrintingForm.form.selectedPrinterName)
      })
    })

    describe('onReset', () => {
      it('resets the forms data', () => {
        wrapper.setData({
          form: { selectedPrinterName: 'stub' },
        })

        const evt = {
          preventDefault: () => {
            return {}
          },
        }
        labelPrintingForm.onReset(evt)
        expect(labelPrintingForm.form.barcode).toEqual(null)
        expect(labelPrintingForm.form.selectedSuffix).toEqual(null)
        expect(labelPrintingForm.form.selectedNumberOfLabels).toEqual(null)
        expect(labelPrintingForm.form.selectedPrinterName).toEqual(null)
      })
    })

    describe('#sendPrintRequest', () => {
      beforeEach(() => {
        wrapper.setData({
          form: {
            barcode: 'aBarcode',
            selectedSuffix: 'ESHR',
            selectedNumberOfLabels: 2,
            selectedPrinterName: 'stub',
            copies: '1',
          },
        })

        labelPrintingForm.printJob = vi.fn()
        labelPrintingForm.showAlert = vi.fn()
      })

      it('calls printJob successfully', async () => {
        const response = { success: true, data: { message: 'a msg' } }
        labelPrintingForm.printJob.mockImplementation(() => response)

        await labelPrintingForm.sendPrintRequest()

        const expectedParams = {
          barcodesList: ['aBarcode-ESHR1', 'aBarcode-ESHR2'],
          printerName: labelPrintingForm.form.selectedPrinterName,
          copies: '1',
          suffix: 'ESHR',
        }

        expect(labelPrintingForm.printJob).toBeCalledWith(expectedParams)
        expect(labelPrintingForm.showAlert).toBeCalledWith('a msg', 'success')
      })

      it('calls printJob unsuccessfully', async () => {
        const response = { success: false, data: { message: 'an error msg' } }
        labelPrintingForm.printJob.mockImplementation(() => response)

        await labelPrintingForm.sendPrintRequest()

        const expectedParams = {
          barcodesList: ['aBarcode-ESHR1', 'aBarcode-ESHR2'],
          printerName: labelPrintingForm.form.selectedPrinterName,
          copies: '1',
          suffix: 'ESHR',
        }

        expect(labelPrintingForm.printJob).toBeCalledWith(expectedParams)
        expect(labelPrintingForm.showAlert).toBeCalledWith('an error msg', 'danger')
      })
    })
  })
})
