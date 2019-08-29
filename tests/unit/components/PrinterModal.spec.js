import { mount, localVue, store } from '../testHelper'
import PrinterModal from '@/components/PrinterModal'

describe('Modal.vue', () => {

  let wrapper, modal

  beforeEach(() => {
    wrapper = mount(PrinterModal, {
      localVue,
      store,
      propsData: {
        disabled: true,
        isStatic: true
      },
      methods: {
        provider () { return }
      }
    })
    modal = wrapper.vm
  })

  it('will have a name', () => {
    expect(wrapper.name()).toEqual('PrinterModal')
  })

  it('will have a printerOptions', () => {
    modal.setPrinterNames()
    expect(modal.printerOptions.length).not.toBe(0)
  })

  it('will have an button component', () => {
    expect(wrapper.contains('.btn')).toBe(true)
  })

  it('will have an modal component', () => {
    expect(wrapper.contains('.modal')).toBe(true)
  })

  describe('data', () => {
    it('has a selectedPrinterId', () => {
      wrapper.setData({ selectedPrinterId: 1 })
      expect(modal.selectedPrinterId).toBe(1)
    })

    it('has printer options', () => {
      let printerOptions = [{ value: null, text: 'Please select a printer' },
        { value: 1, text: 'print1' },
        { value: 2, text: 'printer2' }]

      wrapper.setData({ printerOptions: printerOptions })
      expect(modal.printerOptions).toEqual(printerOptions)
    })
  })

  describe('modal', () => {
    it('has printer select form', () => {
      let printerOptions = [{ value: null, text: 'Please select a printer' },
        { value: 1, text: 'printer1' },
        { value: 2, text: 'printer2' }]

      wrapper.setData({ printerOptions: printerOptions })
      expect(wrapper.find('select').findAll('option').length).toEqual(printerOptions.length)
    })
  })

  describe('props', () => {
    it('has a disabled property', () => {
      expect(wrapper.props().disabled).toBe(true)
    })
  })

  describe('#handleOk', () => {

    beforeEach(() => {
      modal.handleSubmit = jest.fn()
    })

    it('without selectedPrinterId', () => {
      let evt = { preventDefault: () => { return {} }}
      window.alert = jest.fn()
      modal.handleOk(evt)
      expect(window.alert).toBeCalledWith('Please select a printer')
      expect(modal.handleSubmit).not.toBeCalled()
    })

    it('with selectedEnzymeId', () => {
      wrapper.setData({ selectedPrinterId: 1 })
      let evt = { preventDefault: () => { return {} }}
      modal.handleOk(evt)
      expect(modal.handleSubmit).toBeCalled()
    })
  })

  describe('#handleSubmit', () => {
    it('#handleSubmit', () => {
      wrapper.setData({ selectedPrinterId: 1 })

      let printerOptions = [{ value: null, text: 'Please select a printer' },
        { value: 1, text: 'printer1' },
        { value: 2, text: 'printer2' }]

      wrapper.setData({ printerOptions: printerOptions })

      modal.handleSubmit()
      expect(wrapper.emitted().selectPrinter).toBeTruthy()
      expect(wrapper.emitted().selectPrinter[0]).toEqual(['printer1'])
      expect(modal.selectedPrinterId).toBeFalsy()
    })
  })

  describe('#setPrinterNames', () => {

    it('sets printerOptions data', async () => {
      modal.setPrinterNames()

      expect(modal.printerOptions[0]).toEqual({ value: null, text: "Please select a printer" })
      expect(modal.printerOptions[1]).toBeDefined()
      expect(modal.printerOptions[2]).toBeDefined()
    })
  })
})
