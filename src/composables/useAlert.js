import store from '@/store'
/**
 * A composable function to commit a mutation to the Vuex store.
 * @returns {Function} .showAlert A method that shows an alert. It commits a mutation to the Vuex store.
 * @param {string} message - The message to show in the alert.
 * @param {string} type - The type of the alert.
 * @param {string} dataType - The data type of the alert.
 */
export default function useAlert() {
  const showAlert = (message, type, dataType) => {
    //TODO: This need to be refactored to use the Pinia root store once we have converted all components to use useAlert
    store.commit('traction/addMessage', { type, message, dataType })
  }
  // Return the showAlert method
  return {
    showAlert,
  }
}
