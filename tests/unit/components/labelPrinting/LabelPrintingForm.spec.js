import LabelPrintingForm from '@/components/labelPrinting/LabelPrintingForm'
import SuffixList from '@/config/SuffixList'
import { createSuffixDropdownOptions } from '@/lib/LabelPrintingHelpers'
import { mount, createTestingPinia, RequestFactory, flushPromises } from '@support/testHelper'
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

const printerRequestFactory = RequestFactory('Printers', false)

const plugins = [
  ({ store }) => {
    if (store.$id === 'root') {
      store.api.traction.printers.get = vi.fn().mockResolvedValue(printerRequestFactory.response)
    }
  },
]

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

describe('LabelPrintingForm.vue', () => {
  let wrapper, store, labelPrintingForm

  describe('computed properties', () => {
    beforeEach(async () => {
      const { wrapperObj, storeObj } = mountWithStore({
        plugins,
      })

      await flushPromises()
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
    it('should have the correct number', async () => {
      const { wrapperObj } = mountWithStore({
        plugins,
      })

      wrapperObj.vm.form = options

      await flushPromises()

      wrapper = wrapperObj

      // 3 barcodes and 3 of each
      expect(wrapper.vm.labels.length).toEqual(9)
    })

    it('should remove new lines', async () => {
      const { wrapperObj } = mountWithStore({
        plugins,
      })

      await flushPromises()

      wrapperObj.vm.form = {
        ...options,
        sourceBarcodeList: 'SQSC-1\nSQSC-2\nSQSC-3\n\n',
        numberOfLabels: 1,
      }

      wrapper = wrapperObj

      expect(wrapper.vm.labels.length).toEqual(3)
    })
  })

  describe('methods', () => {
    describe('onReset', () => {
      it('resets the forms data', async () => {
        const { wrapperObj } = mountWithStore({
          plugins,
        })

        await flushPromises()

        wrapper = wrapperObj

        labelPrintingForm = wrapper.vm

        labelPrintingForm.form = { printerName: 'stub' }

        labelPrintingForm.onReset(evt)

        // when we move this to the composition api we can test the form is reset using defaultForm
        expect(labelPrintingForm.form).toEqual({
          sourceBarcodeList: null,
          suffix: null,
          numberOfLabels: null,
          printerName: null,
          copies: 1,
        })
      })
    })

    describe('#printLabels', () => {
      it('calls printJob successfully', async () => {
        const { wrapperObj, storeObj } = mountWithStore({
          plugins,
        })

        await flushPromises()

        wrapper = wrapperObj
        store = storeObj

        labelPrintingForm = wrapper.vm
        labelPrintingForm.form = options

        store.createPrintJob = vi.fn().mockImplementation(() => {
          return { success: true, message: 'success' }
        })

        const result = await labelPrintingForm.printLabels(evt)

        const expected = {
          printerName: options.printerName,
          labels: labelPrintingForm.labels,
          copies: options.copies,
        }

        expect(store.createPrintJob).toBeCalledWith(expected)
        expect(result).toEqual({ success: true, message: 'success' })
      })

      // not sure we need to test failure??
      it('calls printJob unsuccessfully', async () => {
        labelPrintingForm.createPrintJob = vi.fn().mockImplementation(() => {
          return { success: false, message: 'failure' }
        })

        const { wrapperObj, storeObj } = mountWithStore({
          plugins,
        })

        await flushPromises()

        wrapper = wrapperObj
        store = storeObj

        labelPrintingForm = wrapper.vm
        labelPrintingForm.form = options

        store.createPrintJob = vi.fn().mockImplementation(() => {
          return { success: false, message: 'failure' }
        })

        const result = await labelPrintingForm.printLabels(evt)

        const expected = {
          printerName: options.printerName,
          labels: labelPrintingForm.labels,
          copies: options.copies,
        }

        expect(store.createPrintJob).toBeCalledWith(expected)
        expect(result).toEqual({ success: false, message: 'failure' })
      })
    })
  })
})
