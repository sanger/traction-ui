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
}
