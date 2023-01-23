const getters = {
  // runs: (state) => state.runs,
  run: (state) => (id) => {
    return state.runs.find((run) => run.id == id)
  },
  currentRun: (state) => state.currentRun,
  runRequest: (state, getters, rootState) => rootState.api.traction.ont.runs,
  instrumentRequest: (state, getters, rootState) => rootState.api.traction.ont.instruments,
  instrumentFlowcellLayout: (state) => state.instrumentFlowcellLayout,
  instruments: (state) => state.instruments,
}

export default getters
