import { handleResponse } from '@/api/ResponseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'
import { newRun, createRunType, RunTypeEnum } from './run'

// Asynchronous update of state.
export default {
  /**
   * Retrieves a list of pacbio smrt_link_versions and populates the store.
   * @param rootState the vuex rootState object. Provides access to current state
   * @param commit the vuex commit object. Provides access to mutations
   * @returns { success, errors }. Was the request successful? were there any errors?
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
   * Retrieves a list of pools based on a filter
   * @param rootState the vuex rootState object. Provides access to current state
   * @param commit the vuex commit object. Provides access to mutations
   * @param filter the barcode(s) to find the pools for
   * @returns { success, errors }. Was the request successful? were there any errors?
   * TODO: remove getter. Better to use rootState
   */
  findPools: async ({ commit, getters }, filter) => {
    // when users search for nothing, prompt them to enter a barcode
    if (filter['barcode'].trim() === '') {
      return {
        success: false,
        errors: ['Please provide a plate barcode'],
      }
    }

    const request = getters.poolRequest
    const promise = request.get({
      include: 'tube,libraries.tag,libraries.request',
      fields: {
        requests: 'sample_name',
        tubes: 'barcode',
        tags: 'group_id',
        libraries: 'request,tag,run_suitability',
      },
      filter,
    })
    const response = await handleResponse(promise)

    const { success, data: { data, included = [] } = {}, errors = [] } = response
    // success is true with an empty list when no pools match the filter
    if (success && data.length > 0) {
      const { tubes, libraries, tags, requests } = groupIncludedByResource(included)

      // commit pools, tubes, libraries, tags and requests
      commit('setPools', data)
      commit('setTubes', tubes)
      commit('setLibraries', libraries)
      commit('setTags', tags)
      commit('setRequests', requests)
      return { success, errors }
    } else {
      return { success: false, errors: [`Unable to find pool with barcode: ${filter['barcode']}`] }
    }
  },

  /**
   * Retrieves a pacbio run and populates the store.
   * @param rootState the vuex rootState object. Provides access to current state
   * @param commit the vuex commit object. Provides access to mutations
   * @returns { success, errors }. Was the request successful? were there any errors?
   */
  fetchRun: async ({ commit, rootState }, { id }) => {
    const request = rootState.api.traction.pacbio.runs
    const promise = request.find({ id })
    const response = await handleResponse(promise)

    const { success, data: { data, included = [] } = {}, errors = [] } = response

    // create run, wells, pools and tubes
    // TODO: we need to add libraries tags and requests to cover existing runs
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
   * @returns { success, errors }. Was the request successful? were there any errors?
   */
  saveRun: async ({ rootState, state: { runType, run, wells } }) => {
    const request = rootState.api.traction.pacbio.runs

    // based on the runType create the payload and the promise
    const payload = runType.payload({ run, wells })
    const promise = runType.promise({ request, payload })
    const response = await handleResponse(promise)

    const { success, errors = [] } = response

    return { success, errors }
  },

  /**
   * Sets the current run. If it is a new run it will be created.
   * If it is an existing run it will be updated.
   * @param rootState the vuex rootState object. Provides access to current state
   * @param dispatch We need to call another action
   * @param commit the vuex commit object. Provides access to mutations
   * @param id The id of the run. It will be new or existing
   * @returns { success, errors }. Was the action successful? were there any errors?
   *
   */
  setRun: async ({ commit, dispatch, rootState }, { id }) => {
    // create and commit the runType based on the id
    const runType = createRunType({ id })
    commit('populateRunType', runType)

    // if it is a new create a new run and commit it
    if (runType.type === RunTypeEnum.New) {
      // eslint-disable-next-line no-unused-vars
      const { id: _id, ...attributes } = newRun()

      commit('populateRun', { id, attributes })

      // success will always be true and errors will be empty
      return { success: true, errors: [] }
    }

    // call the fetch run action
    const { success, errors = [] } = await dispatch('fetchRun', { commit, rootState }, { id })

    // return the result from the fetchRun
    return { success, errors }
  },
}
