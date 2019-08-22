const getters = {
  tractionTubes:   state => state.tractionTubes,
  runs:            state => state.runs,
  tubeRequest:     (state, getters, rootState) => rootState.api.traction.saphyr.tubes,
  requestsRequest: (state, getters, rootState) => rootState.api.traction.saphyr.requests,
  libraryRequest:  (state, getters, rootState) => rootState.api.traction.saphyr.libraries,
  runRequest:      (state, getters, rootState) => rootState.api.traction.saphyr.runs,
}

export default getters
