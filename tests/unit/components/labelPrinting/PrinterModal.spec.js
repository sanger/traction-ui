import {
  mount,
  nextTick,
  RequestFactory,
  createTestingPinia,
  flushPromises,
} from '@support/testHelper.js'
import PrinterModal from '@/components/labelPrinting/PrinterModal.vue'
import { usePrintingStore } from '@/stores/printing.js'

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
function mountWithStore({ state = {}, stubActions = false, plugins = [], props } = {}) {
  const wrapperObj = mount(PrinterModal, {
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
    props,
  })
  const storeObj = usePrintingStore()
  return { wrapperObj, storeObj }
}

describe('PrinterModal.vue', () => {
  let wrapper, modal, store

  beforeEach(async () => {
    const { wrapperObj, storeObj } = mountWithStore({
      plugins,
      props: {
        disabled: true,
        isStatic: true,
      },
    })

    await flushPromises()
    wrapper = wrapperObj
    store = storeObj
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
    beforeEach(() => {
      modal.handleSubmit = vi.fn()
    })

    it('without selectedPrinterId', () => {
      const evt = {
        preventDefault: () => {
          return {}
        },
      }
      window.alert = vi.fn()
      modal.handleOk(evt)
      expect(window.alert).toBeCalledWith('Please select a printer')
      expect(modal.handleSubmit).not.toBeCalled()
    })

    it('with selected printer', () => {
      wrapper.vm.selectedPrinterId = 1
      const evt = {
        preventDefault: () => {
          return {}
        },
      }
      modal.handleOk(evt)
      expect(modal.handleSubmit).toBeCalled()
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
