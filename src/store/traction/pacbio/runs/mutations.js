import * as PacbioRun from '@/api/PacbioRun'

const splitPosition = (position) => {
  // match() returns [original, row, column] e.g "A10 => ["A10", "A", "10"]
  return position.match(/(\S)(\d+)/).slice(1)
}

const mutate = (key) => (state, val) => {
  state[key] = val
}

const mutateRun = (key) => (state, val) => {
  state.currentRun[key] = val
}

const getCurrentWell = (state, position) => {
  let currentWell = state.currentRun.plate.wells.find((well) => well.position === position)

  // If well does not exist - Build a new well
  if (!currentWell) {
    // Duplication of createWell mutation below
    let generateHiFiDefault = getGenerateHiFiDefault(state.currentRun.system_name)
    let defaultBindingKitBoxBarcode = state.currentRun.default_binding_kit_box_barcode
    currentWell = PacbioRun.buildWell(
      ...splitPosition(position),
      generateHiFiDefault,
      defaultBindingKitBoxBarcode,
    )
    state.currentRun.plate.wells.push(currentWell)
  }

  return currentWell
}

const getGenerateHiFiDefault = (systemName) => {
  if (systemName == 'Sequel I' || systemName == 'Sequel II') {
    return 'In SMRT Link'
  } else if (systemName == 'Sequel IIe') {
    return 'On Instrument'
  } else {
    return ''
  }
}

const mutations = {
  setRuns: mutate('runs'),
  setCurrentRun: mutate('currentRun'),
  setSequencingKitBoxBarcode: mutateRun('sequencing_kit_box_barcode'),
  setDNAControlComplexBoxBarcode: mutateRun('dna_control_complex_box_barcode'),
  setComments: mutateRun('comments'),
  setSystemName: mutateRun('system_name'),
  setDefaultBindingKitBoxBarcode: mutateRun('default_binding_kit_box_barcode'),

  createWell(state, position) {
    let defaultBindingKitBoxBarcode = state.currentRun.default_binding_kit_box_barcode
    let generateHiFiDefault = getGenerateHiFiDefault(state.currentRun.system_name)
    let currentWell = PacbioRun.buildWell(
      ...splitPosition(position),
      generateHiFiDefault,
      defaultBindingKitBoxBarcode,
    )
    state.currentRun.plate.wells.push(currentWell)
  },
  mutateWell(state, payload) {
    let currentWell = getCurrentWell(state, payload.position)
    currentWell[payload.property] = payload.with
  },
  // TODO Remove these library methods
  addEmptyLibraryToWell(state, position) {
    let currentWell = getCurrentWell(state, position)
    currentWell.libraries.push({ id: '', barcode: '' })
  },
  removeLibraryFromWell(state, payload) {
    let currentWell = getCurrentWell(state, payload.position)
    currentWell.libraries.splice(payload.index, 1)
  },
  addLibraryToWell(state, payload) {
    let index = payload.index
    let currentWell = getCurrentWell(state, payload.position)
    if (index !== undefined) {
      currentWell.libraries.splice(index, 1, payload.with)
      currentWell.libraries = [...currentWell.libraries]
    } else {
      currentWell.libraries.push(payload.with)
    }
  },
  addEmptyPoolToWell(state, position) {
    let currentWell = getCurrentWell(state, position)
    currentWell.pools.push({ id: '', barcode: '' })
  },
  removePoolFromWell(state, { index, position }) {
    let currentWell = getCurrentWell(state, position)
    currentWell.pools.splice(index, 1)
  },
  addPoolToWell(state, { index, position, with: pool }) {
    let currentWell = getCurrentWell(state, position)
    if (index !== undefined) {
      currentWell.pools.splice(index, 1, pool)
    } else {
      currentWell.pools.push(pool)
    }
  },
}

export default mutations
