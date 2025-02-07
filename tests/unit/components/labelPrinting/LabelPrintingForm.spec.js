import LabelPrintingForm from '@/components/labelPrinting/LabelPrintingForm.vue'
import { createWorkflowDropdownOptions } from '@/lib/LabelPrintingHelpers.js'
import { mountWithStore, flushPromises, nextTick } from '@support/testHelper.js'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePrintingStore } from '@/stores/printing.js'
import PrinterFactory from '@tests/factories/PrinterFactory.js'
import WorkflowFactory from '@tests/factories/WorkflowFactory.js'

const options = {
  sourceBarcodeList: 'SQSC-1\nSQSC-2\nSQSC-3',
  numberOfLabels: 3,
  copies: 1,
  printerName: 'aPrinter',
}

const evt = {
  preventDefault: () => {
    return {}
  },
}

const printersFactory = PrinterFactory()
const workflowFactory = WorkflowFactory()

const plugins = [
  ({ store }) => {
    if (store.$id === 'root') {
      store.api.traction.printers.get = vi.fn().mockResolvedValue(printersFactory.responses.fetch)

      store.api.traction.workflows.get = vi.fn().mockResolvedValue(workflowFactory.responses.fetch)
    }
  },
]

describe('LabelPrintingForm.vue', () => {
  let wrapper, store, labelPrintingForm

  beforeEach(async () => {
    ;({ wrapper, store } = mountWithStore(LabelPrintingForm, {
      plugins,
      createStore: () => usePrintingStore(),
    }))

    await flushPromises()
  })

  describe('computed properties', () => {
    it('has the correct printer Options', () => {
      expect(wrapper.vm.printerOptions.length).toEqual(store.printers('tube').length)
    })

    it('has the correct Workflow Dropdown Options', () => {
      expect(wrapper.vm.workflowDropdownOptions).toEqual(
        createWorkflowDropdownOptions(store.pipelines),
      )
    })
  })

  /*
   * this is an arbitary test to ensure we get the right number
   * we have tested the methods in the helper library
   * we also have a e2e test
   */
  describe('labels', () => {
    it('should have the correct number', async () => {
      // for reactive data we need to set the data on the form
      // you can't reassign the form
      // could we reset this on mount?
      Object.assign(wrapper.vm.printJob, options)

      // 3 barcodes and 3 of each
      expect(wrapper.vm.workflowBarcodeItems.length).toEqual(9)
    })

    it('should remove new lines', async () => {
      wrapper.vm.printJob.sourceBarcodeList = 'SQSC-1\nSQSC-2\nSQSC-3\n\n'
      wrapper.vm.printJob.numberOfLabels = 1

      expect(wrapper.vm.workflowBarcodeItems.length).toEqual(3)
    })
  })

  describe('methods', () => {
    describe('onReset', () => {
      it('resets the forms data', async () => {
        labelPrintingForm = wrapper.vm
        labelPrintingForm.printJob.printerName = 'stub'
        labelPrintingForm.onReset(evt)

        // we need to JSON.stringify otherwise we get a Compared values have no visual difference error. No idea why!
        expect(JSON.stringify(labelPrintingForm.printJob)).toEqual(
          JSON.stringify(labelPrintingForm.PrintJobType()),
        )
      })
    })

    describe('#printLabels', () => {
      it('calls printJob successfully', async () => {
        labelPrintingForm = wrapper.vm
        // the tests pass irrespective of this line??
        Object.assign(labelPrintingForm.printJob, options)

        store.createPrintJob = vi.fn().mockImplementation(() => {
          return { success: true, message: 'success' }
        })

        const result = await labelPrintingForm.printLabels(evt)

        expect(store.createPrintJob).toBeCalledWith(labelPrintingForm.printJob.payload())
        expect(result).toEqual({ success: true, message: 'success' })
      })

      it('calls printJob unsuccessfully', async () => {
        labelPrintingForm.createPrintJob = vi.fn().mockImplementation(() => {
          return { success: false, message: 'failure' }
        })
        labelPrintingForm = wrapper.vm
        Object.assign(labelPrintingForm.printJob, options)

        store.createPrintJob = vi.fn().mockImplementation(() => {
          return { success: false, message: 'failure' }
        })

        const result = await labelPrintingForm.printLabels(evt)

        expect(store.createPrintJob).toBeCalledWith(labelPrintingForm.printJob.payload())
        expect(result).toEqual({ success: false, message: 'failure' })
      })
    })

    describe('label types', () => {
      beforeEach(async () => {
        labelPrintingForm = wrapper.vm
      })

      it('should present some label types', () => {
        expect(
          wrapper.find('[data-attribute=label-type-options]').findAll('option').length,
        ).toEqual(Object.values(labelPrintingForm.LabelTypes).length)
      })

      it('should limit printers to the selected label type', () => {
        expect(wrapper.find('[data-attribute=printer-options]').findAll('option').length).toEqual(
          store.printers(labelPrintingForm.labelType.labwareType).length,
        )
      })

      it('should list printers if selected label type is changed', async () => {
        labelPrintingForm.labelOptions.labelTypeKey = 'plate961d'
        await nextTick()
        expect(wrapper.find('[data-attribute=printer-options]').findAll('option').length).toEqual(
          store.printers(labelPrintingForm.labelType.labwareType).length,
        )
      })
    })
  })
})
