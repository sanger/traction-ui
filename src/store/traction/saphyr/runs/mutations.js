const mutations = {
    setRuns(state, runs) {
        state.runs = runs
    },
    setCurrentRun(state, run) {
        state.currentRun = run
    },
    updateRunName(state, name) {
        state.currentRun.name = name
    },
    updateChipBarcode(state, barcode) {
        state.currentRun.chip.barcode = barcode
    },
    updateLibrary(state, payload) {
        let library = payload.library
        let flowcellIndex = payload.flowcellIndex
        state.currentRun.chip.flowcells[flowcellIndex].library = library
    }
}

export default mutations