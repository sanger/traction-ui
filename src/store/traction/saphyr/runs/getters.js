const getters = {
  runs: (state) => state.runs,
  runRequest: (state, getters, rootState) => rootState.api.traction.saphyr.runs,
  run: (state) => (id) => {
    return state.runs.find((run) => run.id == id)
  },
  currentRun: (state) => state.currentRun,
  saphyrRequests: (state, getters, rootState) => rootState.api.traction.saphyr,
}

export default getters
