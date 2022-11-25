import LabelPrintingForm from '@/components/labelPrinting/LabelPrintingForm'
import SuffixList from '@/config/SuffixList'
import { localVue, mount, store } from '@support/testHelper'
import { beforeEach, describe, expect, it } from 'vitest'

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

  it('has the correct printer Options', () => {
    expect(labelPrintingForm.printerOptions.length).toEqual(store.getters.printers.length)
  })

  it('has the correct Suffix Options', () => {
    // includes no suffix option
    expect(labelPrintingForm.suffixOptions.length).toEqual(Object.values(SuffixList).length + 1)

    // each workflow has a set number of options
    // check the first one
    expect(labelPrintingForm.suffixOptions[0].options.length).toEqual(
      Object.values(SuffixList)[0].options.length,
    )

    // and the last one
    const lastIndex = Object.values(SuffixList).length - 1
    expect(labelPrintingForm.suffixOptions[lastIndex].options.length).toEqual(
      Object.values(SuffixList)[lastIndex].options.length,
    )
  })

  describe.skip('labels', () => {
    const options = {
      barcodeList: 'SQSC-1\nSQSC-2\nSQSC-3',
      stage: 'UPRL',
      numberOfLabels: 3,
    }

    beforeEach(() => {
      wrapper = mount(LabelPrintingForm, {
        localVue,
        store,
        data() {},
      })
      labelPrintingForm = wrapper.vm
    })

    it('works', () => {
      expect(true).toBeTruthy()
    })

    it('with no stage or number of labels', () => {
      const expected = [{}]

      const wrapper = mount(LabelPrintingForm, {
        localVue,
        store,
        data() {
          return {
            form: { ...options, stage: null, numberOfLabels: null },
          }
        },
      })

      expect(wrapper.vm.labels).toEqual(expected)
    })

    it('with a stage', () => {})

    it('with number of labels', () => {})

    it('with stage and number of labels', () => {})
  })

  describe('methods', () => {
    describe('suffixedBarcodes', () => {
      it('created the list of suffixed barcodes when all form data is present', () => {
        wrapper.setData({
          form: {
            barcode: 'aBarcode',
            selectedSuffix: 'ESHR',
            selectedNumberOfLabels: 2,
          },
        })
        expect(labelPrintingForm.suffixedBarcodes()).toEqual(['aBarcode-ESHR-1', 'aBarcode-ESHR-2'])
      })
      it('returns an empty list when barcode is not present', () => {
        wrapper.setData({
          form: { selectedSuffix: 'ESHR', selectedNumberOfLabels: 2 },
        })
        expect(labelPrintingForm.suffixedBarcodes()).toEqual([])
      })
      it('can add barcode without suffix', () => {
        wrapper.setData({
          form: { selectedSuffix: 'No suffix', barcode: 'aBarcode', selectedNumberOfLabels: 2 },
        })
        expect(labelPrintingForm.suffixedBarcodes()).toEqual(['aBarcode-1', 'aBarcode-2'])
      })
      it('can add barcode without lables', () => {
        wrapper.setData({
          form: { barcode: 'aBarcode', selectedSuffix: 'HXCL' },
        })
        expect(labelPrintingForm.suffixedBarcodes()).toEqual(['aBarcode-HXCL'])
      })
      it('can add barcode without suffix and labels', () => {
        wrapper.setData({
          form: { selectedSuffix: 'No suffix', barcode: 'aBarcode' },
        })
        expect(labelPrintingForm.suffixedBarcodes()).toEqual(['aBarcode'])
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
          barcodesList: ['aBarcode-ESHR-1', 'aBarcode-ESHR-2'],
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
          barcodesList: ['aBarcode-ESHR-1', 'aBarcode-ESHR-2'],
          printerName: labelPrintingForm.form.selectedPrinterName,
          copies: '1',
          suffix: 'ESHR',
        }

        expect(labelPrintingForm.printJob).toBeCalledWith(expectedParams)
        expect(labelPrintingForm.showAlert).toBeCalledWith('an error msg', 'danger')
      })
    })

    describe('create labels', () => {
      it('works', () => {
        expect(true).toBeTruthy()
      })
    })
  })
})
