const getters = {
  requests: (state) => state.requests,
  requestsRequest: (state, getters, rootState) => rootState.api.v1.traction.saphyr.requests,
}

export default getters
