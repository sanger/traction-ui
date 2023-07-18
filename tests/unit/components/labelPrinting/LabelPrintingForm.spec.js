import LabelPrintingForm from '@/components/labelPrinting/LabelPrintingForm'
import SuffixList from '@/config/SuffixList'
import { createSuffixDropdownOptions } from '@/lib/LabelPrintingHelpers'
import { localVue, mount, store } from '@support/testHelper'
import { beforeEach, describe, expect, it } from 'vitest'

const options = {
  sourceBarcodeList: 'SQSC-1\nSQSC-2\nSQSC-3',
  suffix: 'UPRL',
  numberOfLabels: 3,
  copies: 1,
  printerName: 'aPrinter',
}

const evt = {
  preventDefault: () => {
    return {}
  },
}

describe('LabelPrintingForm.vue', () => {
  let wrapper, labelPrintingForm

  describe('computed properties', () => {
    beforeEach(() => {
      wrapper = mount(LabelPrintingForm, {
        localVue,
        store,
        props: {},
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
  describe('labels', () => {
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

    it('should remove new lines', () => {
      const wrapper = mount(LabelPrintingForm, {
        localVue,
        store,
        data() {
          return {
            form: {
              ...options,
              sourceBarcodeList: 'SQSC-1\nSQSC-2\nSQSC-3\n\n',
              numberOfLabels: 1,
            },
          }
        },
      })

      expect(wrapper.vm.labels.length).toEqual(3)
    })
  })

  describe('methods', () => {
    describe('onReset', () => {
      it('resets the forms data', () => {
        wrapper.setData({
          form: { printerName: 'stub' },
        })

        labelPrintingForm = wrapper.vm

        labelPrintingForm.onReset(evt)
        expect(labelPrintingForm.form.sourceBarcodeList).toEqual(null)
        expect(labelPrintingForm.form.suffix).toEqual(null)
        expect(labelPrintingForm.form.numberOfLabels).toEqual(null)
        expect(labelPrintingForm.form.printerName).toEqual(null)
      })
    })

    describe('#printLabels', () => {
      beforeEach(() => {
        const wrapper = mount(LabelPrintingForm, {
          localVue,
          store,
          data() {
            return {
              form: options,
            }
          },
        })

        labelPrintingForm = wrapper.vm
      })

      it('calls printJob successfully', async () => {
        labelPrintingForm.createPrintJob = vi.fn().mockImplementation(() => {
          return { success: true, message: 'success' }
        })

        const result = await labelPrintingForm.printLabels(evt)

        const expected = {
          printerName: options.printerName,
          labels: labelPrintingForm.labels,
          copies: options.copies,
        }

        expect(labelPrintingForm.createPrintJob).toBeCalledWith(expected)
        expect(result).toEqual({ success: true, message: 'success' })
      })

      // not sure we need to test failure??
      it('calls printJob unsuccessfully', async () => {
        labelPrintingForm.createPrintJob = vi.fn().mockImplementation(() => {
          return { success: false, message: 'failure' }
        })

        const result = await labelPrintingForm.printLabels(evt)

        const expected = {
          printerName: options.printerName,
          labels: labelPrintingForm.labels,
          copies: options.copies,
        }

        expect(labelPrintingForm.createPrintJob).toBeCalledWith(expected)
        expect(result).toEqual({ success: false, message: 'failure' })
      })
    })
  })
})
