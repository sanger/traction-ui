/**
 * A helper mixin to store commonly used functionality
 */
export default {
  name: 'Helper',
  methods: {
    /**
     * Toggle the alert (of type provided) on the page with the provided message
     * @param {*} message the message to show in the alert box
     * @param {string} [type='primary'] the variant of the alert
     */
    showAlert(message, type = 'primary') {
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
    }
  }
}
