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

  findPacbioPools: async ({ commit, rootState }, filter) => {
    // Here we want to make sure the filter exists
    // If it doesn't exist the request will return all plates
    if (filter['barcode'].trim() === '') {
      return {
        success: false,
        errors: ['Please provide a plate barcode'],
      }
    }

    // If there are multiple barcodes being searched,
    // separate and concatenate with a comma
    filter['barcode'].split('\n').join(',')

    const request = rootState.api.traction.pacbio.pools
    const promise = request.get({
      filter,
      include: 'tube,libraries.tag,libraries.request',
    })
    const response = await handleResponse(promise)
    let { success, data: { data, included = [] } = {}, errors = [] } = response
    const { tubes, libraries, tags, requests } = groupIncludedByResource(included)

    // We will return a successful empty list if no pools match the filter
    // Therefore we want to error if we don't have any pools
    if (!data.lenght) {
      success = false
      errors = [`Unable to find plate with barcode: ${filter['barcode']}`]
    }

    if (success) {
      commit('populateRequests', requests)
      commit('populateTubes', tubes)
      commit('populateTags', tags)
      commit('populateLibraries', libraries)
      commit('setPools', data)
    }

    return { success, errors }
  },
}
