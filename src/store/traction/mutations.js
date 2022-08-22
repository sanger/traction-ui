import Vue from 'vue'
import { populateById } from '@/api/JsonApi'

const mutations = {
  setTags(state, tags) {
    state.tractionTags = tags
  },
  updateRun(state, run) {
    let runIndex = state.pacbio.runs.runs.map((e) => e.id).indexOf(run.id)

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
   * Populated with resources via API calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} qcAssayTypes The qcAssayType resources to populate the store
   */
   populateQcAssayTypes: populateById('qcAssayTypes', { includeRelationships: true })
}

export default mutations
