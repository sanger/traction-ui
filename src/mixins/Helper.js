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
      // https://stackoverflow.com/a/264037
      if (process.env.VUE_APP_LOG === 'true') {
        console.log(message)
      }
    },
    async handlePrintLabel(printerName) {
      let response = await printJob(printerName, this.selected)
      let variant = response.successful ? 'success' : 'danger'
      this.showAlert(
        response.successful ? consts.MESSAGE_SUCCESS_PRINTER : response.errors.message,
        variant,
      )
    },
    /**
     * https: //stackoverflow.com/a/1026087
     * @param {*} string the string to capitalize
     */
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    },
    // capitalise first letter and remove dashes (can add more when need be)
    humanise(string) {
      return this.capitalizeFirstLetter(string).replace(/-/g, ' ')
    },
  },
}
