import store from '@/store'
import { useRoute } from 'vue-router'

/**
 * A composable function to commit a mutation to the Vuex store.
 * @returns {Function} .showAlert A method that shows an alert. It commits a mutation to the Vuex store.
 * @param {string} message - The message to show in the alert.
 * @param {string} type - The type of the alert.
 * @param {string} dataType - The data type of the alert.
 */
export default function useAlert() {
  const route = useRoute()

  const showAlert = (message, type, dataType) => {
    const origin = route?.name || 'Unknown Origin'
    const time = new Date().toLocaleTimeString()

    // Commit the mutation  to the Vuex store
    store.commit('traction/addMessage', { type, message, dataType, origin, time })
  }

  // Return the showAlert method
  return {
    showAlert,
  }
}
