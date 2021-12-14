/**
 * A helper mixin to store commonly used functionality
 */
import { printJob } from '@/api/PrintJobRequests'
import * as consts from '@/consts/consts'

export default {
  name: 'PrintHelper',
  methods: {
    async handlePrintLabel(printerName) {
      let response = await printJob(printerName, this.selected)

      if (response.successful) {
        this.showAlert(consts.MESSAGE_SUCCESS_PRINTER, 'success')
      } else {
        this.showAlert(response.errors.message, 'danger')
      }
    },
  },
}
