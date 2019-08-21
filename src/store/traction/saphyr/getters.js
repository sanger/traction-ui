const getters = {
  tractionTubes:   state => state.tractionTubes,
  tubeRequest:     (state, getters, rootState) => rootState.api.traction.saphyr.tubes,
  requestsRequest: (state, getters, rootState) => rootState.api.traction.saphyr.requests,
  libraryRequest:  (state, getters, rootState) => rootState.api.traction.saphyr.libraries
}

export default getters
