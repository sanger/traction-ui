// Actions handle asynchronous update of state, via mutations.
// Note: The { commit } in the given example is destucturing
// the store context
// see https://vuex.vuejs.org/guide/actions.html
export default {
  fetchPacbioPlates: ({ commit }) => {
   //doStuff
   commit('populatePlates', [])
   commit('populateWells', [])
   commit('populateRequests', [])
  },
  fetchPacbioTagSets: ({ commit }) => {
   //doStuff
   commit('populateTagSets', [])
   commit('populateTags', [])
  }
}
