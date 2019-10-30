const getters = {
    runs: state => state.runs,
    runRequest: (state, getters, rootState) => rootState.api.traction.pacbio.runs,
    currentRun: state => state.currentRun,
    pacbioRequests: (state, getters, rootState) => rootState.api.traction.pacbio,
}

export default getters