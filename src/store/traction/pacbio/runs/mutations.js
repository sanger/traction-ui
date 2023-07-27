import { dataToObjectById, extractAttributes } from '@/api/JsonApi'

const mutations = {
  /**
   * Populate runs based on a service response
   * @param {Object} state The VueXState object
   * @param {Object} data A response object
   **/
  setRuns: (state, data) => {
    state.runs = dataToObjectById({ data, includeRelationships: true })
  },
  updateRun(state, run) {
    state.runs[run.id] = extractAttributes(run)
  },
}

export default mutations
