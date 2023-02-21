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
  poolBarcodes: (state) => {
    if (state.currentRun.id == 'new') {
      return null
    } else {
      const pools = state.currentRun.plate.wells.flatMap((well) => well.pools)
      return pools.map((pool) => pool.tube.barcode).join(',')
    }
  },
}

export default getters
