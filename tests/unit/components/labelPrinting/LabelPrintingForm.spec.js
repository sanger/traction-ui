import LabelPrintingForm from '@/components/labelPrinting/LabelPrintingForm'
import SuffixList from '@/config/SuffixList'
import { createSuffixDropdownOptions } from '@/lib/LabelPrintingHelpers'
import { mount, createTestingPinia } from '@support/testHelper'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePrintingStore } from '@/stores/printing.js'

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

/**
 * Helper method for mounting a component with a mock instance of pinia, with the given props.
 * This method also returns the wrapper and the store object for further testing.
 *
 * @param {*} - params to be passed to the createTestingPinia method for creating a mock instance of pinia
 * which includes
 * state - initial state of the store
 * stubActions - boolean to stub actions or not.
 * plugins - plugins to be used while creating the mock instance of pinia.
 */
function mountWithStore({ state = {}, stubActions = false, plugins = [] } = {}) {
  const wrapperObj = mount(LabelPrintingForm, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            printing: state,
          },
          stubActions,
          plugins,
        }),
      ],
    },
  })
  const storeObj = usePrintingStore()
  return { wrapperObj, storeObj }
}

const printers = {
  1: { id: 1, name: 'printer1', labware_type: 'tube' },
  2: { id: 2, name: 'printer2', labware_type: 'tube' },
  3: { id: 3, name: 'printer3', labware_type: 'tube' },
  4: { id: 4, name: 'printer4', labware_type: 'tube' },
  5: { id: 5, name: 'printer5', labware_type: 'plate' },
  6: { id: 6, name: 'printer6', labware_type: 'plate' },
}

describe('LabelPrintingForm.vue', () => {
  let wrapper, store, labelPrintingForm

  describe.only('computed properties', () => {
    beforeEach(() => {
      const { wrapperObj, storeObj } = mountWithStore({
        state: {
          resources: {
            printers,
          },
        },
      })

      wrapper = wrapperObj
      store = storeObj
    })

    it('has the correct printer Options', () => {
      expect(wrapper.vm.printerOptions.length).toEqual(store.printers('tube').length)
    })

    it('has the correct Suffix Options', () => {
      expect(wrapper.vm.suffixOptions).toEqual(createSuffixDropdownOptions(SuffixList))
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
