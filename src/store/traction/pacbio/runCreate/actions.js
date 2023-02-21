import { handleResponse } from '@/api/ResponseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'

const findPools = async ({ commit, getters }, filter) => {
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
    commit('setPools', data)
    commit('setTubes', tubes)
    commit('setLibraries', libraries)
    commit('setTags', tags)
    commit('setRequests', requests)
    return { success, errors }
  } else {
    return { success: false, errors: [`Unable to find pool with barcode: ${filter['barcode']}`] }
  }
}

const actions = { findPools }

export { findPools }

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
  ...actions,
}
