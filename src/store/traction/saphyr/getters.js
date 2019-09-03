const getters = {
  runs:            state => state.runs,
  libraryRequest:  (state, getters, rootState) => rootState.api.traction.saphyr.libraries,
  runRequest:      (state, getters, rootState) => rootState.api.traction.saphyr.runs,
  chipRequest:     (state, getters, rootState) => rootState.api.traction.saphyr.chips,
  run:             state => (id) => {
    return state.runs.find(run => run.id == id)
  },
  currentRun:      state => state.currentRun,
}

export default getters
