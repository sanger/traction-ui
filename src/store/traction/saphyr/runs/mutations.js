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
    updateLibraryBarcode(state, payload) {
        let barcode = payload.barcode
        let flowcellIndex = payload.flowcellIndex
        state.currentRun.chip.flowcells[flowcellIndex].library.barcode = barcode
    }
}

export default mutations