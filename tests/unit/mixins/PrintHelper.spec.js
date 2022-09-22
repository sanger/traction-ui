import PrintHelper from '@/mixins/PrintHelper'
import { localVue, mount } from '@support/testHelper'

describe('PrintHelper', () => {
  let helper, wrapper
  const selected = []
  const testPrinterName = 'printer_1'

  let printJobV2Success = vi.fn()
  printJobV2Success.mockResolvedValue({ success: true, data: { message: 'Printed successfully' } })
  let printJobV2Fail = vi.fn()
  printJobV2Fail.mockResolvedValue({ success: false, data: { message: 'did not work' } })

  const mountWrapper = (printJobV2Mock) => {
    wrapper = mount(PrintHelper, {
      localVue,
      template: '<div />',
      data() {
        return {
          selected,
        }
      },
      methods: {
        printJobV2: printJobV2Mock,
      },
      render() {},
    })

    helper = wrapper.vm
  }

  describe('#handlePrintLabel', () => {
    it('handles success', async () => {
      mountWrapper(printJobV2Success)

      const showAlert = vi.spyOn(helper, 'showAlert')
      showAlert.mockImplementation(() => {})

      await helper.handlePrintLabel('pipeline_1', testPrinterName)

      expect(helper.showAlert).toHaveBeenCalledWith('Printed successfully', 'success')
    })

    it('handles failure', async () => {
      mountWrapper(printJobV2Fail)

      const showAlert = vi.spyOn(helper, 'showAlert')
      showAlert.mockImplementation(() => {})

      await helper.handlePrintLabel('pipeline_1', testPrinterName)

      expect(helper.showAlert).toHaveBeenCalledWith('did not work', 'danger')
    })
  })
})
