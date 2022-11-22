import { handleResponse } from '@/api/ResponseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'

export default {
  findOntPlate: async ({ commit, rootState }, filter) => {
    // Here we want to make sure the filter exists
    // If it doesn't exist the request will return all plates
    if (filter['barcode'].trim() === '') {
      return {
        success: false,
        errors: ['Please provide a plate barcode'],
      }
    }

    const request = rootState.api.traction.ont.plates
    const promise = request.get({ filter: filter, include: 'wells.requests' })
    const response = await handleResponse(promise)
    let { success, data: { data, included = [] } = {}, errors = [] } = response
    const { wells, requests } = groupIncludedByResource(included)

    // We will be return a successful empty list if no plates match the filter
    // Therefore we want to return an error if we don't have any plates
    if (!data.length) {
      success = false
      errors = [`Unable to find plate with barcode: ${filter['barcode']}`]
    }

    if (success) {
      // We want to grab the first (and only) record from the applied filter
      commit('selectPlate', { id: data[0].id, selected: true })
      commit('populatePlates', data)
      commit('populateWells', wells)
      commit('populateRequests', requests)
    }

    return { success, errors }
  },

  /**
   * Inverts the selected state of all requests associated with a
   * well. We May need to iterate on this if we have multiple requests
   * per well.
   * @param state the vuex state object. Provides access to current state
   * @param commit the vuex commit object. Provides access to mutations
   */
  selectWellRequests: ({ commit, state }, well_id) => {
    const { requests } = state.resources.wells[well_id]
    const selectedRequests = state.libraries
    for (let id of requests) {
      const selected = !!selectedRequests[`_${id}`]
      commit('selectRequest', { id, selected: !selected })
    }
  },

  fetchOntRequests: async ({ commit, rootState }, filter) => {
    const request = rootState.api.traction.ont.requests
    const promise = request.get({ filter: filter })
    const response = await handleResponse(promise)

    let { success, data: { data } = {}, errors = [] } = response

    // We will be return a successful empty list if no requests match the filter
    // Therefore we want to return an error if we don't have any requests
    if (!data.length) {
      success = false
      errors = [`Unable to find requests with the applied filter`]
    }

    if (success) {
      commit('setRequests', data)
    }

    return { success, errors }
  },

  fetchOntTagSets: async ({ commit, rootState }) => {
    const request = rootState.api.traction.ont.tag_sets
    const promise = request.get({ include: 'tags' })
    const response = await handleResponse(promise)

    const { success, data: { data, included = [] } = {}, errors = [] } = response

    if (success) {
      commit('populateTagSets', data)
      /* We are currently only including tags. So this is really simple */
      commit('populateTags', included)
    }

    return { success, errors, response }
  },
}
