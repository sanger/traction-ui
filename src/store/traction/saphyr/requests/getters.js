const getters = {
  requests: (state) => {
    return Object.values(state.requests)
  },
  requestsRequest: (state, getters, rootState) => {
    return rootState.api.v2.traction.saphyr.requests
  },
}

export default getters
