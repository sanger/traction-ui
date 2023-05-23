const getters = {
  runs: (state) => Object.values(state.runs),
  runRequest: (state, getters, rootState) => rootState.api.traction.pacbio.runs,
}

export default getters
