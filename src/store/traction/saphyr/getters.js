const getters = {
  tractionTubes:   state => state.tractionTubes,
  runs:            state => state.runs,
  tubeRequest:     (state, getters, rootState) => rootState.api.traction.saphyr.tubes,
  requestsRequest: (state, getters, rootState) => rootState.api.traction.saphyr.requests,
  libraryRequest:  (state, getters, rootState) => rootState.api.traction.saphyr.libraries,
  runRequest:      (state, getters, rootState) => rootState.api.traction.saphyr.runs,
  chipRequest:     (state, getters, rootState) => rootState.api.traction.saphyr.chips,
  run:             state => (id) => {
    return state.runs.find(run => run.id == id)
  },
  currentRun:      state => state.currentRun,
}

export default getters
