import store from '@/store'
/**
 * A composable function that provides a method to show an alert.
 * @returns {Function} .showAlert A method that shows an alert. It commits a mutation to the Vuex store.
 * @param {string} message - The message to show in the alert.
 * @param {string} type - The type of the alert.
 * @param {string} dataType - The data type of the alert.
 */
export default function useAlert() {
  //const store = useStore()

  const showAlert = (message, type, dataType) => {
    store.commit('traction/addMessage', { type, message: String(message), dataType })
  }

  return {
    showAlert,
  }
}
