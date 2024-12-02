import { handleResponse } from '@/api/v2/ResponseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'

export default {
  /**
   * Retrieves a list of ont runs from traction-service and populates the source
   * with associated instrument data
   * @param rootState the vuex rootState object. Provides access to the current state
   * @param commit the vuex commit object. Provides access to mutations
   */
  fetchOntRuns: async ({ commit, rootState }, filter, page) => {
    const request = rootState.api.v2.traction.ont.runs
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
  setInstruments: async ({ commit, rootState }) => {
    // TODO: Remove use of v1
    const request = rootState.api.v1.traction.ont.instruments
    const promise = request.get()
    const response = await handleResponse(promise)
    const { success, data: { data } = {}, errors = [] } = response

    if (success) {
      commit('setInstruments', data)
    }
    return { success, errors, response }
  },
}
