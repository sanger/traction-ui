import { handleResponse } from '@/api/ResponseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'

// Asynchronous update of state.
export default {
  /**
   * Retrieves a list of pacbio smrt_link_versions and populates the store.
   * @param rootState the vuex rootState object. Provides access to current state
   * @param commit the vuex commit object. Provides access to mutations
   */
  fetchSmrtLinkVersions: async ({ commit, rootState }) => {
    const request = rootState.api.traction.pacbio.smrt_link_versions
    const promise = request.get({})
    const response = await handleResponse(promise)

    const { success, data: { data } = {}, errors = [] } = response

    if (success) {
      commit('populateSmrtLinkVersions', data)
    }
    return { success, errors }
  },

  /**
   * Retrieves a pacbio run and populates the store.
   * @param rootState the vuex rootState object. Provides access to current state
   * @param commit the vuex commit object. Provides access to mutations
   */
  fetchRun: async ({ commit, rootState }) => {
    const request = rootState.api.traction.pacbio.runs
    const promise = request.find({})
    const response = await handleResponse(promise)

    const { success, data: { data, included = [] } = {}, errors = [] } = response

    if (success) {
      const { wells, pools, tubes } = groupIncludedByResource(included)
      commit('populateRun', data)
      commit('populateWells', wells)
      commit('populatePools', pools)
      commit('populateTubes', tubes)
    }
    return { success, errors }
  },
}
