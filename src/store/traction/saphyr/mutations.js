const mutations = {
  setTubes (state, tubes) {
    state.tractionTubes = tubes
  },
  setRuns (state, runs) {
    state.runs = runs
  },
  addRun (state, run) {
    state.runs.push(run)
  },
  updateRun (state, run) {
    state.runs[run.id] = run
  },
  setCurrentRun (state, run) {
    state.currentRun = run
  },
  updateName (state, name) {
    state.currentRun.name = name
  },
  updateBarcode (state, barcode) {
    state.currentRun.chip.barcode = barcode
  },
  updateLibraryBarcode (state, payload) {
    let index = payload.index
    let libraryBarcode = payload.libraryBarcode
    state.currentRun.chip.flowcells[index].library.barcode = libraryBarcode
  }
}

export default mutations
