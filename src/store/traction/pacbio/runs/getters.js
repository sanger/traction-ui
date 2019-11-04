const getters = {
    runs: state => state.runs,
    runRequest: (state, getters, rootState) => rootState.api.traction.pacbio.runs,
    currentRun: state => state.currentRun,
    well: state => (position) => {
        return state.currentRun.plate.wells.find(well => well.position === position)
    }
}

export default getters