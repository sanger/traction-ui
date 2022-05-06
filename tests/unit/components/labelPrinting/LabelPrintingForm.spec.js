import LabelPrintingForm from '@/components/labelPrinting/LabelPrintingForm'
import { localVue, mount, store } from 'testHelper'

describe('LabelPrintingForm.vue', () => {
  let wrapper, labelPrintingForm

  beforeEach(() => {
    wrapper = mount(LabelPrintingForm, {
      localVue,
      stubs: {
        LabelPrintingModal: true,
      },
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

  describe('form', () => {
    it('will have barcode_input_group', () => {
      expect(wrapper.find('#barcode_input_group').exists()).toBeTruthy()
    })

    it('will have labelPrintingModal', () => {
      expect(wrapper.find('#labelPrintingModal').exists()).toBeTruthy()
    })

    it('will have barcode_input', () => {
      expect(wrapper.find('#barcode_input').exists()).toBeTruthy()
    })

    it('will have suffix_selection_group', () => {
      expect(wrapper.find('#suffix_selection_group').exists()).toBeTruthy()
    })

    it('will have number_of_labels_group', () => {
      expect(wrapper.find('#number_of_labels_group').exists()).toBeTruthy()
    })

    it('will have number_of_labels', () => {
      expect(wrapper.find('#number_of_labels').exists()).toBeTruthy()
    })

    it('will have printer_choice_group', () => {
      expect(wrapper.find('#printer_choice_group').exists()).toBeTruthy()
    })

    it('will have copies component', () => {
      expect(wrapper.find('#copies_group').exists()).toBeTruthy()
    })
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
    it('has a form with copies', () => {
      wrapper.setData({ form: { copies: '1' } })
      expect(labelPrintingForm.form.copies).toBe('1')
    })
  })

  describe('computed', () => {
    describe('formValid', () => {
      it('returns false when the form is invalid', () => {
        expect(labelPrintingForm.formValid).toEqual(false)
      })
      it('returns false when the form is invalid', () => {
        wrapper.setData({
          form: {
            barcode: 'aBarcode',
            selectedSuffixId: 1,
            selectedNumberOfLabels: 2,
            selectedPrinterId: 2,
            copies: '1',
          },
        })
        expect(labelPrintingForm.formValid).toEqual(true)
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

    describe('propsToPass', () => {
      it('created the props to pass when all form data is present', () => {
        wrapper.setData({
          form: {
            barcode: 'aBarcode',
            selectedSuffixId: 1,
            selectedNumberOfLabels: 2,
            selectedPrinterId: 1,
            copies: '1',
          },
        })
        const expected = {
          barcodesList: ['aBarcode-L1', 'aBarcode-L2'],
          printer: labelPrintingForm.printerOptions[1],
          copies: '1',
        }
        expect(labelPrintingForm.propsToPass()).toEqual(expected)
      })

      it('returns an empty list when form data is not present', () => {
        wrapper.setData({
          form: { selectedSuffixId: 1, selectedNumberOfLabels: 2 },
        })
        expect(labelPrintingForm.suffixedBarcodes()).toEqual([])
      })
    })

    describe('suffixedBarcodes', () => {
      it('created the list of suffixed barcodes when all form data is present', () => {
        wrapper.setData({
          form: {
            barcode: 'aBarcode',
            selectedSuffixId: 1,
            selectedNumberOfLabels: 2,
            selectedPrinterId: 1,
            copies: '1',
          },
        })
        expect(labelPrintingForm.suffixedBarcodes()).toEqual(['aBarcode-L1', 'aBarcode-L2'])
      })

      it('returns an empty list when form data is not present', () => {
        wrapper.setData({
          form: { selectedSuffixId: 1, selectedNumberOfLabels: 2 },
        })
        expect(labelPrintingForm.suffixedBarcodes()).toEqual([])
      })
    })

    describe('printer', () => {
      it('gets the printer', () => {
        wrapper.setData({ form: { selectedPrinterId: 1 } })
        expect(labelPrintingForm.printer()).toEqual(labelPrintingForm.printerOptions[1])
      })
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
