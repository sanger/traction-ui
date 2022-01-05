/**
 * A helper mixin to store commonly used functionality
 */
import { printJob } from '@/api/PrintJobRequests'

const MESSAGE_SUCCESS_PRINTER = 'Printed successfully'

export default {
  name: 'PrintHelper',
  methods: {
    async handlePrintLabel(printerName) {
      let { successful, errors: { message } = {} } = await printJob(printerName, this.selected)

      if (successful) {
        this.showAlert(MESSAGE_SUCCESS_PRINTER, 'success')
      } else {
        this.showAlert(message, 'danger')
      }
    },
  },
}
