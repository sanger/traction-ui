const getters = {
  requests: (state) => Object.values(state.requests),
  // requestsRequest: (state, getters, rootState) => rootState.api.v2.traction.pacbio.requests,
  requestsRequest: (state, getters, rootState) => rootState.api.v1.traction.pacbio.requests,
}

export default getters
