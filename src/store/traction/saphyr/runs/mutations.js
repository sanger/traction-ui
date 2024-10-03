const mutations = {
  setRuns(state, runs) {
    state.runs = runs
  },
  setCurrentRun(state, run) {
    state.currentRun = run
  },
  setRunName(state, name) {
    state.currentRun.name = name
  },
  setChipBarcode(state, barcode) {
    state.currentRun.chip.barcode = barcode
  },
  setLibraryBarcode(state, payload) {
    const library = payload.library
    const flowcellIndex = payload.flowcellIndex
    state.currentRun.chip.flowcells[flowcellIndex].library = library
  },
}

export default mutations
