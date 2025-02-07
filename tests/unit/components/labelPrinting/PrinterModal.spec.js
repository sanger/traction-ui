import { mountWithStore, nextTick, flushPromises } from '@support/testHelper.js'
import PrinterModal from '@/components/labelPrinting/PrinterModal.vue'
import { usePrintingStore } from '@/stores/printing.js'
import PrinterFactory from '@tests/factories/PrinterFactory.js'

const printerFactory = PrinterFactory()

const plugins = [
  ({ store }) => {
    if (store.$id === 'root') {
      store.api.traction.printers.get = vi.fn().mockResolvedValue(printerFactory.responses.fetch)
    }
  },
]

describe('PrinterModal.vue', () => {
  let wrapper, modal, store

  beforeEach(async () => {
    ;({ wrapper, store } = mountWithStore(PrinterModal, {
      plugins,
      props: {
        disabled: true,
        isStatic: true,
      },
      createStore: () => usePrintingStore(),
    }))

    await flushPromises()
    modal = wrapper.vm
  })

  it('will have some printer options', async () => {
    wrapper.vm.isShow = true
    await nextTick()
    expect(wrapper.find('select').findAll('option').length).toEqual(
      store.printers('tube').length + 1,
    )
  })

  it('has a selectedPrinterId', () => {
    wrapper.vm.selectedPrinterId = 1
    expect(modal.selectedPrinterId).toBe(1)
  })

  describe('#handleOk', () => {
    it('without selectedPrinterId', () => {
      window.alert = vi.fn()
      modal.handleOk()
      expect(window.alert).toBeCalledWith('Please select a printer')
    })

    it('with selected printer', () => {
      wrapper.vm.selectedPrinterId = 1
      modal.handleOk()
      expect(wrapper.emitted().selectPrinter).toBeTruthy()
      expect(wrapper.emitted().selectPrinter[0]).toEqual([store.printers('tube')[0].name])
    })
  })

  describe('#handleSubmit', () => {
    it('#handleSubmit', () => {
      wrapper.vm.selectedPrinterId = 1

      modal.handleSubmit()
      expect(wrapper.emitted().selectPrinter).toBeTruthy()
      expect(wrapper.emitted().selectPrinter[0]).toEqual([store.printers('tube')[0].name])
      expect(modal.selectedPrinterId).toBeFalsy()
    })
  })
})
