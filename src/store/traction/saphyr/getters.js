const getters = {
  tractionTubes: state => state.tractionTubes,
  tubeRequest: (state, getters, rootState) => rootState.api.traction.saphyr.tubes,
  requestsRequest: (state, getters, rootState) => rootState.api.traction.saphyr.requests,
}

export default getters
