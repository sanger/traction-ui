import PrintHelper from '@/mixins/PrintHelper'
import { localVue, mount } from '@support/testHelper'

describe('PrintHelper', () => {
  let helper, wrapper
  const selected = []

  const mountWrapper = (printJobMock) => {
    wrapper = mount(PrintHelper, {
      localVue,
      template: '<div />',
      data() {
        return {
          selected,
        }
      },
      methods: {
        printJob: printJobMock,
      },
      render() {},
    })

    helper = wrapper.vm
  }

  describe('#handlePrintLabel', () => {
    it('handles success', async () => {
      let printJobSuccess = vi.fn()
      printJobSuccess.mockResolvedValue({
        success: true,
        data: { message: 'Printed successfully' },
      })
      mountWrapper(printJobSuccess)

      const showAlert = vi.spyOn(helper, 'showAlert')
      showAlert.mockImplementation(() => {})

      await helper.handlePrintLabel('pipeline_1', 'printer_1')

      expect(helper.showAlert).toHaveBeenCalledWith('Printed successfully', 'success')
    })

    it('handles failure', async () => {
      let printJobFail = vi.fn()
      printJobFail.mockResolvedValue({ success: false, data: { message: 'did not work' } })
      mountWrapper(printJobFail)

      const showAlert = vi.spyOn(helper, 'showAlert')
      showAlert.mockImplementation(() => {})

      await helper.handlePrintLabel('pipeline_1', 'printer_1')

      expect(helper.showAlert).toHaveBeenCalledWith('did not work', 'danger')
    })
  })
})
