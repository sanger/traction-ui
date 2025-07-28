import { handleResponse } from '@/api/ResponseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'

export default {
  /**
   * Retrieves a list of ont runs from traction-service and populates the source
   * with associated instrument data
   * @param rootState the vuex rootState object. Provides access to the current state
   * @param commit the vuex commit object. Provides access to mutations
   */
  fetchOntRuns: async ({ commit, rootState }, filter, page) => {
    const request = rootState.api.traction.ont.runs
    const promise = request.get({ page, filter, include: 'instrument' })

    const response = await handleResponse(promise)

    const { success, body: { data, included = [], meta = {} } = {}, errors = [] } = response
    const { instruments } = groupIncludedByResource(included)

    if (success) {
      commit('setRuns', data)
      commit('populateInstruments', instruments)
    }

    return { success, errors, meta }
  },
}
