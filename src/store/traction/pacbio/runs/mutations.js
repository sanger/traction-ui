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
    const wellIndex = state.currentRun.plate.wells.findIndex((w) => w.position === well.position)
    state.currentRun.plate.wells.splice(wellIndex, 1, well)
  },
  deleteWell(state, well) {
    const wellIndex = state.currentRun.plate.wells.findIndex((w) => w.position === well.position)

    // If well exists in DB we want to delete it from db when run is updated
    well.id ? state.currentRun.plate.wellsToDelete.push(well.id) : ''
    state.currentRun.plate.wells.splice(wellIndex, 1)
  },
}

export default mutations
