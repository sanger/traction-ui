const getters = {
  runs: (state) => Object.values(state.runs),
  run: (state) => (id) => {
    return state.runs.find((run) => run.id == id)
  },
  runRequest: (state, getters, rootState) => rootState.api.traction.pacbio.runs,
  currentRun: (state) => state.currentRun,
  pacbioRequests: (state, getters, rootState) => rootState.api.traction.pacbio,
  well: (state) => (position) => {
    return state.currentRun.plate.wells.find((well) => well.position === position)
  },
}

export default getters
