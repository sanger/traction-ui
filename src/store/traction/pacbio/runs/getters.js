const getters = {
    runs: state => state.runs,
    runRequest: (state, getters, rootState) => rootState.api.traction.pacbio.runs,
    currentRun: state => state.currentRun
}

export default getters