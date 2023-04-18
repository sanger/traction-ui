import Vue from 'vue'
import defaultState from './state'

const mutations = {
  setTags(state, tags) {
    state.tractionTags = tags
  },
  addMessage(state, message) {
    const messageId = Object.keys(state.messages).pop()
    Vue.set(state.messages, messageId + 1, message)
  },
  removeMessage(state, messageIndex) {
    Vue.delete(state.messages, messageIndex)
  },
  /**
   * Clears all messages
   * @param {Object} state The Vuex state object
   */
  clearMessages(state) {
    const new_state = defaultState()
    // Keep tractionTags but clear messages
    Object.assign(state, new_state, { tractionTags: state.tractionTags })
  },
}

export default mutations
