import LabelPrintingForm from '@/components/labelPrinting/LabelPrintingForm'
import { localVue, mount, store } from 'testHelper'

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
    expect(wrapper.find('#resetButton').exists()).toBeTruthy()
  })

  it('will have an modal component', () => {
    expect(wrapper.find('#labelPrintingModal').exists()).toBeTruthy()
  })

  describe('data', () => {
    it('has a form with a barcode', () => {
      wrapper.setData({ form: { barcode: 'aBarcode' } })
      expect(labelPrintingForm.form.barcode).toBe('aBarcode')
    })
    it('has a form with selectedSuffixId', () => {
      wrapper.setData({ form: { selectedSuffixId: 1 } })
      expect(labelPrintingForm.form.selectedSuffixId).toBe(1)
    })
    it('has a form with a selectedNumberOfLabels', () => {
      wrapper.setData({ form: { selectedNumberOfLabels: '2' } })
      expect(labelPrintingForm.form.selectedNumberOfLabels).toBe('2')
    })
    it('has a form with a selectedPrinterId', () => {
      wrapper.setData({ form: { selectedPrinterId: 1 } })
      expect(labelPrintingForm.form.selectedPrinterId).toBe(1)
    })
  })

  describe('computed', () => {
    describe('suffixedBarcodes', () => {
      it('created the list of suffixed barcodes when form data is present', () => {
        wrapper.setData({
          form: { barcode: 'aBarcode', selectedSuffixId: 1, selectedNumberOfLabels: 2 },
        })
        expect(labelPrintingForm.suffixedBarcodes).toEqual(['aBarcode-L1', 'aBarcode-L2'])
      })

      it('returns an empty list when form data is not present', () => {
        wrapper.setData({
          form: { selectedSuffixId: 1, selectedNumberOfLabels: 2 },
        })
        expect(labelPrintingForm.suffixedBarcodes).toEqual([])
      })
    })
    describe('printerName', () => {
      it('returns the printer name when selectedPrinterId is present', () => {
        wrapper.setData({
          form: {
            barcode: 'aBarcode',
            selectedSuffixId: 1,
            selectedNumberOfLabels: 2,
            selectedPrinterId: 1,
          },
        })
        expect(labelPrintingForm.printerName).toEqual('g216bc')
      })

      it('returns an empty string when selectedPrinterId is not present', () => {
        expect(labelPrintingForm.printerName).toEqual('')
      })
    })
  })

  describe('methods', () => {
    it('setSuffixOptions ', async () => {
      // +1 for null value
      expect(labelPrintingForm.suffixOptions.length).toEqual(store.getters.suffixes.length + 1)
    })

    it('setPrinterNames ', async () => {
      // +1 for null value
      expect(labelPrintingForm.printerOptions.length).toEqual(store.getters.printers.length + 1)
    })

    describe('onReset', () => {
      it('resets the forms data', () => {
        wrapper.setData({
          form: { selectedPrinterId: 1 },
        })

        const evt = {
          preventDefault: () => {
            return {}
          },
        }
        labelPrintingForm.onReset(evt)
        expect(labelPrintingForm.form.barcode).toEqual(null)
        expect(labelPrintingForm.form.selectedSuffixId).toEqual(null)
        expect(labelPrintingForm.form.selectedNumberOfLabels).toEqual(null)
        expect(labelPrintingForm.form.selectedPrinterId).toEqual(null)
      })
    })
  })
})
