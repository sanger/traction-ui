const getters = {
  currentRun: (state) => state.currentRun,
  runRequest: (state, getters, rootState) => rootState.api.traction.ont.runs,
  instrumentFlowcellLayout: (state) => state.instrumentFlowcellLayout,
}

export default getters
