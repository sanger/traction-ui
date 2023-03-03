import { handleResponse } from '@/api/ResponseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'
import { createPayload } from '@/store/traction/pacbio/runCreate/run'

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

  /**
   * Saves (persists) the existing run. If it is a new run it will be created.
   * If it is an existing run it will be updated.
   * @param rootState the vuex rootState object. Provides access to current state
   * @param state {runs, wells}. The current run and it's wells
   * TODO: There is a lot of jiggery pokery to get everything working in the method
   * and tests so a factory might be the best idea.
   */
  saveRun: async ({ rootState, state: { run, wells } }) => {
    const request = rootState.api.traction.pacbio.runs
    const { id, ...runAttributes } = run
    const wellValues = Object.values(wells)

    const payload =
      id === 'new'
        ? createPayload({ run: runAttributes, wells: wellValues })
        : createPayload({ id, run: runAttributes, wells: wellValues })

    const promise = id === 'new' ? request.create({ data: payload }) : request.update(payload)

    const response = await handleResponse(promise)

    const { success, errors = [] } = response

    return { success, errors }
  },
}
