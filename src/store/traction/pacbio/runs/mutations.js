const mutate = (key) => (state, val) => {
  state[key] = val
}

const mutateRun = (key) => (state, val) => {
  state.currentRun[key] = val
}

const mutations = {
  setRuns: mutate('runs'),
  setCurrentRun: mutate('currentRun'),
  setSequencingKitBoxBarcode: mutateRun('sequencing_kit_box_barcode'),
  setDNAControlComplexBoxBarcode: mutateRun('dna_control_complex_box_barcode'),
  setComments: mutateRun('comments'),
  setSystemName: mutateRun('system_name'),
  setDefaultBindingKitBoxBarcode: mutateRun('default_binding_kit_box_barcode'),

  createWell(state, well) {
    state.currentRun.plate.wells.push(well)
  },
  updateWell(state, well) {
    let existingWell = state.currentRun.plate.wells.find((w) => w.position === well.position)
    let wellIndex = state.currentRun.plate.wells.indexOf(existingWell)
    state.currentRun.plate.wells.splice(wellIndex, 1, well)
  },
  deleteWell(state, position) {
    let well = state.currentRun.plate.wells.find((well) => well.position === position)
    let wellIndex = state.currentRun.plate.wells.indexOf(well)
    state.currentRun.plate.wells.splice(wellIndex, 1)
  },
}

export default mutations
