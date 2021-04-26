const getters = {
  tractionTubes: (state) => state.tractionTubes,
  tubeRequest: (state, getters, rootState) => rootState.api.traction.pacbio.tubes,
  requestsRequest: (state, getters, rootState) => rootState.api.traction.pacbio.requests,
}

export default getters
