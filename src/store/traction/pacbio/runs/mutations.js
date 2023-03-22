import Vue from 'vue'
import { dataToObjectById } from '@/api/JsonApi'

const mutations = {
  /**
   * Populate runs based on a service response
   * @param {Object} state The VueXState object
   * @param {Object} data A response object
   **/
  setRuns: (state, data) => {
    Vue.set(state, 'runs', {
      ...state.runs,
      ...dataToObjectById({ data, includeRelationships: true }),
    })
  },
}

export default mutations
