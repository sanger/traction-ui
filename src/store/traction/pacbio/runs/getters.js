const getters = {
    runs: state => state.runs,
    runRequest: (rootState) => rootState.api.traction.pacbio.runs,
    currentRun: state => state.currentRun,
    pacbioRequests: (rootState) => rootState.api.traction.pacbio
}

export default getters