import defaultState from './state'

const mutations = {
  addMessage(state, message) {
    const messageId = Object.keys(state.messages).pop()
    state.messages[messageId + 1] = message
  },
  removeMessage(state, messageIndex) {
    delete state.messages[messageIndex]
  },
  /**
   * Clears all messages
   * @param {Object} state The Vuex state object
   */
  clearMessages(state) {
    const new_state = defaultState()
    // clear messages
    Object.assign(state, new_state)
  },
}

export default mutations
