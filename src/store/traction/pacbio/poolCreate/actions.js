import handlePromise from '@/api/PromiseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'

// Actions handle asynchronous update of state, via mutations.
// Note: The { commit } in the given example is destucturing
// the store context
// see https://vuex.vuejs.org/guide/actions.html
export default {
  fetchPacbioPlates: async ({ commit, rootState }) => {
    const request = rootState.api.traction.pacbio.plates
    const promise = request.get({ include: 'wells.requests' })
    const {
      _body: { data, included },
    } = await handlePromise(promise)
    const { wells, requests } = groupIncludedByResource(included)
    commit('populatePlates', data)
    commit('populateWells', wells)
    commit('populateRequests', requests)
  },
  fetchPacbioTagSets: async ({ commit, rootState }) => {
    const request = rootState.api.traction.pacbio.tag_sets
    /* I've been explicit about the includes here as we make an assumption
       below that only tags are included. */
    const promise = request.get({ include: 'tags' })
    const {
      _body: { data, included },
    } = await handlePromise(promise)

    commit('populateTagSets', data)
    /* We are currently only including tags. So this is really simple */
    commit('populateTags', included)
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
}
