import { groupIncludedByResource } from '@/api/JsonApi'
import { validate, payload, valid } from '@/store/traction/pacbio/poolCreate/pool'
import { handleResponse } from '@/api/ResponseHelper'

// Actions handle asynchronous update of state, via mutations.
// Note: The { commit } in the given example is destucturing
// the store context
// see https://vuex.vuejs.org/guide/actions.html
export default {
  fetchPacbioPlates: async ({ commit, rootState }) => {
    const request = rootState.api.traction.pacbio.plates
    const promise = request.get({ include: 'wells.requests' })
    const response = await handleResponse(promise)

    const { success, data: { data, included = [] } = {}, errors = [] } = response

    if (success) {
      const { wells, requests } = groupIncludedByResource(included)
      commit('populatePlates', data)
      commit('populateWells', wells)
      commit('populateRequests', requests)
    }

    return { success, errors }
  },
  fetchPacbioTagSets: async ({ commit, rootState }) => {
    const request = rootState.api.traction.pacbio.tag_sets
    /* I've been explicit about the includes here as we make an assumption
       below that only tags are included. */
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
  /**
   * When a plate is deselected, we need to also remove all its requests
   */
  deselectPlateAndContents: ({ commit, state }, plateId) => {
    commit('selectPlate', { id: plateId, selected: false })
    const { wells } = state.resources.plates[plateId]
    for (let wellId of wells) {
      const { requests = [] } = state.resources.wells[wellId]
      for (let requestId of requests) {
        commit('selectRequest', { id: requestId, selected: false })
      }
    }
  },

  /*
   * Creates a pool from the libraries
   */
  createPool: async ({ rootState, state: { libraries, pool } }) => {
    validate({ libraries })
    if (!valid({ libraries })) return
    const request = rootState.api.traction.pacbio.pools
    const promise = request.create(payload({ libraries, pool }), { include: 'tube' })
    // TODO: I think this is the best I can do here but it may be an idea to extract this into a method
    // if we have to do it more often
    const { success, data: { included = [] } = {}, errors } = await handleResponse(promise)
    const { tubes: [tube = {}] = [] } = groupIncludedByResource(included)
    const { attributes: { barcode = '' } = {} } = tube
    return { success, barcode, errors }
  },
  /*
   * Update a pool and libraries
   */
  updatePool: async ({ rootState, state: { libraries, pool } }) => {
    validate({ libraries })
    if (!valid({ libraries })) return
    const request = rootState.api.traction.pacbio.pools
    const promise = request.update(payload({ libraries, pool }), { include: 'tube' })
    // TODO: I think this is the best I can do here but it may be an idea to extract this into a method
    // if we have to do it more often
    const { success, errors } = await handleResponse(promise)
    return { success, errors }
  },
  populateLibrariesFromPool: async ({ commit, rootState }, poolId) => {
    const request = rootState.api.traction.pacbio.pools
    const promise = request.find(poolId, {
      // We want to load *all* associated records, as otherwise we might be referencing them
      // before they are loaded. Furthermore, if we start filtering the plates list at all,
      // we may *never* load the relevant records.
      // We load the other wells associated with the plate too, to ensure the remaining plate
      // doesn't appear empty. This is especially important if the pool request finishes
      // after the request for all plates, as otherwise the partial record will over-write
      // the full one.
      include: 'libraries.tag.tag_set,libraries.source_plate.wells.requests',
    })
    const response = await handleResponse(promise)

    const { success, data: { data, included = [] } = {}, errors = [] } = response

    if (success) {
      const {
        libraries,
        requests,
        wells,
        plates,
        tag_sets: [tag_set],
      } = groupIncludedByResource(included)
      commit('populatePoolAttributes', data)
      commit('populateLibraries', libraries)
      commit('populateRequests', requests)
      commit('populateWells', wells)
      commit('populatePlates', plates)
      commit('selectTagSet', tag_set)
      plates.forEach(({ id }) => commit('selectPlate', { id, selected: true }))
    }

    return { success, errors }
  },
}
