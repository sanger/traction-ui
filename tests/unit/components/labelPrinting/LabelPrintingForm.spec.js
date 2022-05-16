import LabelPrintingForm from '@/components/labelPrinting/LabelPrintingForm'
import SuffixList from '@/config/SuffixList'
import { localVue, mount, store } from 'testHelper'

// Once removed modal, fix warning

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
    it('has a form with selectedSuffix', () => {
      wrapper.setData({ form: { selectedSuffix: 'L' } })
      expect(labelPrintingForm.form.selectedSuffix).toBe('L')
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
      expect(labelPrintingForm.suffixOptions.length).toEqual(SuffixList.length)
    })

    it('setPrinterNames ', async () => {
      expect(labelPrintingForm.printerOptions.length).toEqual(store.getters.printers.length)
    })

    describe('propsToPass', () => {
      it('created the props to pass when all form data is present', () => {
        wrapper.setData({
          form: {
            barcode: 'aBarcode',
            selectedSuffix: 'L',
            selectedNumberOfLabels: 2,
            selectedPrinterName: 'stub',
            copies: '1',
          },
        })

        const expected = {
          barcodesList: ['aBarcode-L1', 'aBarcode-L2'],
          printerName: labelPrintingForm.form.selectedPrinterName,
          copies: '1',
        }
        expect(labelPrintingForm.propsToPass()).toEqual(expected)
      })

      // it('returns an empty list when form data is not present', () => {
      //   wrapper.setData({
      //     form: { selectedSuffix: 'L', selectedNumberOfLabels: 2 },
      //   })
      //   labelPrintingForm = wrapper.vm
      //   expect(labelPrintingForm.suffixedBarcodes()).toEqual([])
      // })
    })

    describe('suffixedBarcodes', () => {
      it('created the list of suffixed barcodes when all form data is present', () => {
        wrapper.setData({
          form: {
            barcode: 'aBarcode',
            selectedSuffix: 'L',
            selectedNumberOfLabels: 2,
            selectedPrinterName: 'stub',
            copies: '1',
          },
        })
        expect(labelPrintingForm.suffixedBarcodes()).toEqual(['aBarcode-L1', 'aBarcode-L2'])
      })

      // it('returns an empty list when form data is not present', () => {
      //   wrapper.setData({
      //     form: { selectedSuffix: 'L', selectedNumberOfLabels: 2 },
      //   })
      //   expect(labelPrintingForm.suffixedBarcodes()).toEqual([])
      // })
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
  })
})
