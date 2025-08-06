import useRootStore from '@/stores'
export default {
  name: 'Helper',
  methods: {
    /**
     * Toggle the alert (of type provided) on the page with the provided message
     * @param {*} message the message to show in the alert box
     * @param {string} type the variant (colour) of the alert
     */
    showAlert(message, type, dataType) {
      const rootStore = useRootStore()
      rootStore.addMessage({ type, message: String(message), dataType })
    },
  },
}
