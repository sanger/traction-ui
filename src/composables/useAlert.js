import useRootStore from '@/stores'
/**
 * A composable function to commit a mutation to the Vuex store.
 * @returns {Function} .showAlert A method that shows an alert. It commits a mutation to the Vuex store.
 * @param {string} message - The message to show in the alert.
 * @param {string} type - The type of the alert.
 * @param {string} dataType - The data type of the alert.
 */
export default function useAlert() {
  const store = useRootStore()
  const showAlert = (message, type, dataType) => {
    store.addMessage({ type, message:String(message), dataType })
  }
  // Return the showAlert method
  return {
    showAlert,
  }
}
