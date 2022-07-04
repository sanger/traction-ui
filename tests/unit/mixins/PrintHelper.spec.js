import PrintHelper from '@/mixins/PrintHelper'
import { localVue, mount } from '@support/testHelper'
import * as printJobRequests from '@/api/PrintJobRequests'

vi.mock('@/api/PrintJobRequests')

describe('PrintHelper', () => {
  let helper, wrapper
  const selected = []

  beforeEach(() => {
    wrapper = mount(PrintHelper, {
      localVue,
      template: '<div />',
      data() {
        return {
          selected,
        }
      },
      render() {},
    })

    helper = wrapper.vm
  })

  describe('#handlePrintLabel', () => {
    it('handles success', async () => {
      const printJob = vi.spyOn(printJobRequests, 'printJob')
      const showAlert = vi.spyOn(helper, 'showAlert')

      printJob.mockImplementation(() => {})
      showAlert.mockImplementation(() => {})
      printJob.mockResolvedValue({ successful: true })
      await helper.handlePrintLabel('pipeline', 'hello')
      expect(printJob).toHaveBeenCalledWith('hello', selected, 'pipeline')
      expect(helper.showAlert).toHaveBeenCalledWith('Printed successfully', 'success')
    })

    it('handles failure', async () => {
      const printJob = vi.spyOn(printJobRequests, 'printJob')
      const showAlert = vi.spyOn(helper, 'showAlert')

      printJob.mockImplementation(() => {})
      showAlert.mockImplementation(() => {})
      printJob.mockResolvedValue({ successful: false, errors: { message: 'did not work' } })
      await helper.handlePrintLabel('pipeline', 'hello')
      expect(printJob).toHaveBeenCalledWith('hello', selected, 'pipeline')
      expect(helper.showAlert).toHaveBeenCalledWith('did not work', 'danger')
    })
  })
})
