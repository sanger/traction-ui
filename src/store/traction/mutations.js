import Vue from 'vue'
import defaultState from './state'

const mutations = {
  setTags(state, tags) {
    state.tractionTags = tags
  },
  updateRun(state, run) {
    const runIndex = state.pacbio.runs.runs.map((e) => e.id).indexOf(run.id)

    state.pacbio.runs.runs.splice(runIndex, 1, run)
    state.pacbio.runs.runs = [...state.pacbio.runs.runs]
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
