const getters = {
  runs: (state) => state.runs,
  run: (state) => (id) => {
    return state.runs.find((run) => run.id == id)
  },
  currentRun: (state) => state.currentRun,
  runRequest: (state, getters, rootState) => rootState.api.traction.ont.runs,
  instrumentFlowcellLayout: (state) => state.instrumentFlowcellLayout,
}

export default getters
