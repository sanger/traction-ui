/**
 * A helper mixin to store commonly used functionality
 */
import printJob from '@/api/PrintJobRequests'
import * as consts from '@/consts/consts'

export default {
  name: 'Helper',
  methods: {
    /**
     * Toggle the alert (of type provided) on the page with the provided message
     * @param {*} message the message to show in the alert box
     * @param {string} type the variant (colour) of the alert
     */
    showAlert(message, type) {
      return this.$refs.alert.show(message, type)
    },
    /**
     * Send message to the console - only when not in production
     * @param {*} message the message to log
     */
    log(message) {
      if (process.env !== 'production') {
        console.log(message)
      }
    },
    async handlePrintLabel(printerName) {
      let response = await printJob(printerName, this.selected)

      this.showAlert(response.successful ? consts.MESSAGE_SUCCESS_PRINTER : response.errors.message)
    },
  }
}
