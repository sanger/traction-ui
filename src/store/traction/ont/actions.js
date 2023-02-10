import { handleResponse } from '@/api/ResponseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'

export default {
  /**
   * Retrieves a list of ont runs from traction-service and populates the source
   * with associated instrument data
   * @param rootState the vuex rootState object. Provides access to the current state
   * @param commit the vuex commit object. Provides access to mutations
   */
  fetchOntRuns: async ({ commit, rootState }) => {
    const request = rootState.api.traction.ont.runs
    const promise = request.get({ include: 'instrument' })

    const response = await handleResponse(promise)

    const { success, data: { data, included = [] } = {}, errors = [] } = response
    const { instruments } = groupIncludedByResource(included)

    if (success) {
      commit('setRuns', data)
      commit('populateInstruments', instruments)
    }

    return { success, errors, response }
  },
  setInstruments: async ({ commit, rootState }) => {
    const request = rootState.api.traction.ont.instruments
    const promise = request.get()
    const response = await handleResponse(promise)
    const { success, data: { data } = {}, errors = [] } = response

    if (success) {
      commit('setInstruments', data)
    }
    return { success, errors, response }
  },
}
