import LabelPrintingModal from '@/components/labelPrinting/LabelPrintingModal'
import { localVue, mount, store } from 'testHelper'

describe('Modal.vue', () => {
  let wrapper, modal

  beforeEach(() => {
    wrapper = mount(LabelPrintingModal, {
      localVue,
      store,
      propsData: {
        barcodesList: ['aBarcode-L1', 'aBarcode-L2'],
        printer: { value: 1, text: 'stub', type: 'squix' },
        copies: '3',
        disabled: true,
        isStatic: true,
      },
    })
    modal = wrapper.vm
  })

  it('will have an modal component', () => {
    expect(wrapper.find('.modal')).toBeTruthy()
  })

  it('will have an button component', () => {
    expect(wrapper.find('.btn').element).toBeTruthy()
    expect(wrapper.find('.btn').text()).toEqual('Print Labels')
  })

  describe('modal', () => {
    it('displays the barcodes to be printed name', () => {
      expect(wrapper.find('#list-barcodes-to-print').element).toBeTruthy()
      expect(wrapper.find('#list-barcodes-to-print').text()).toMatch(
        wrapper.props().barcodesList[0],
      )
      expect(wrapper.find('#list-barcodes-to-print').text()).toMatch(
        wrapper.props().barcodesList[1],
      )
    })

    it('displays the printer name', () => {
      expect(wrapper.find('#title').element).toBeTruthy()
      expect(wrapper.find('#title').text()).toEqual('Printer: ' + wrapper.props().printer.text)
    })

    it('displays the number of copies', () => {
      expect(wrapper.find('#copies').element).toBeTruthy()
      expect(wrapper.find('#copies').text()).toEqual('Copies: ' + wrapper.props().copies)
    })
  })

  describe('#sendPrintRequest', () => {
    beforeEach(() => {
      modal.printJobV2 = jest.fn()
      modal.showAlert = jest.fn()
    })

    it('calls printJobV2 successfully', async () => {
      const response = { success: true, data: { message: 'a msg' } }
      modal.printJobV2.mockImplementation(() => response)

      await modal.sendPrintRequest()
      const params = {
        printer: wrapper.props().printer,
        barcodesList: wrapper.props().barcodesList,
        copies: wrapper.props().copies,
      }
      expect(modal.printJobV2).toBeCalledWith(params)
      expect(modal.showAlert).toBeCalledWith('Response: a msg', 'success')
    })

    it('calls printJobV2 successfully', async () => {
      const response = { success: false, errors: 'an error msg' }
      modal.printJobV2.mockImplementation(() => response)

      await modal.sendPrintRequest()
      const params = {
        printer: wrapper.props().printer,
        barcodesList: wrapper.props().barcodesList,
        copies: wrapper.props().copies,
      }
      expect(modal.printJobV2).toBeCalledWith(params)
      expect(modal.showAlert).toBeCalledWith('Print request failed: an error msg', 'danger')
    })
  })
})
