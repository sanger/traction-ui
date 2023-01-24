const getters = {
  currentRun: (state) => state.currentRun,
  runRequest: (state, getters, rootState) => rootState.api.traction.ont.runs,
  instrumentRequest: (state, getters, rootState) => rootState.api.traction.ont.instruments,
  instrumentFlowcellLayout: (state) => state.instrumentFlowcellLayout,
  instruments: (state) => state.instruments,
}

export default getters
