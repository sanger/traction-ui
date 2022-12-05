import LabelPrintingForm from '@/components/labelPrinting/LabelPrintingForm'
import SuffixList from '@/config/SuffixList'
import { createSuffixDropdownOptions } from '@/lib/LabelPrintingHelpers'
import { localVue, mount, store } from '@support/testHelper'
import { beforeEach, describe, expect, it } from 'vitest'

describe('LabelPrintingForm.vue', () => {
  let wrapper, labelPrintingForm

  describe('computed properties', () => {
    beforeEach(() => {
      wrapper = mount(LabelPrintingForm, {
        localVue,
        store,
        propsData: {},
      })
      labelPrintingForm = wrapper.vm
    })

    it('has the correct printer Options', () => {
      expect(labelPrintingForm.printerOptions.length).toEqual(store.getters.printers.length)
    })

    it('has the correct Suffix Options', () => {
      expect(labelPrintingForm.suffixOptions).toEqual(createSuffixDropdownOptions(SuffixList))
    })
  })

  /*
   * this is an arbitary test to ensure we get the right number
   * we have tested the methods in the helper library
   * we also have a e2e test
   */
  describe.skip('labels', () => {
    const options = {
      sourceBarcodeList: 'SQSC-1\nSQSC-2\nSQSC-3',
      suffix: 'UPRL',
      numberOfLabels: 3,
      copies: '1',
    }

    it('should have the correct number', () => {
      const wrapper = mount(LabelPrintingForm, {
        localVue,
        store,
        data() {
          return {
            form: options,
          }
        },
      })

      // 3 barcodes and 3 of each
      expect(wrapper.vm.labels.length).toEqual(9)
    })
  })

  describe.skip('methods', () => {
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
          form: { printerName: 'stub' },
        })

        const evt = {
          preventDefault: () => {
            return {}
          },
        }
        labelPrintingForm.onReset(evt)
        expect(labelPrintingForm.form.sourceBarcodeList).toEqual(null)
        expect(labelPrintingForm.form.suffix).toEqual(null)
        expect(labelPrintingForm.form.numberOfLabels).toEqual(null)
        expect(labelPrintingForm.form.printerName).toEqual(null)
      })
    })

    describe.skip('#sendPrintRequest', () => {
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
