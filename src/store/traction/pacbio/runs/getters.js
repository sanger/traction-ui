const getters = {
    runs: state => state.runs,
    runRequest: (state, getters, rootState) => rootState.api.traction.pacbio.runs
}

export default getters