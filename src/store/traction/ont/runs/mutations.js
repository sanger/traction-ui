import Vue from 'vue'

const mutate = (key) => (state, val) => {
  state[key] = val
}

const mutateRun = (key) => (state, val) => {
  state.currentRun[key] = val
}

const setFlowcellId = () => (state, obj) => {
  const exists = state.currentRun.flowcell_attributes.find(
    (flowcell) => flowcell.position == obj.position,
  )

  if (exists) {
    Vue.set(exists, 'flowcell_id', obj.$event)
  } else {
    let flowcell = { ...{ flowcell_id: obj.$event }, ...{ position: obj.position } }
    state.currentRun.flowcell_attributes.push(flowcell)
  }
}

const setPoolKitBarcode = () => (state, obj) => {
  const exists = state.currentRun.flowcell_attributes.find(
    (flowcell) => flowcell.position == obj.position,
  )

  if (exists) {
    Vue.set(exists, 'ont_pool_kit_barcode', obj.$event)
  } else {
    let flowcell = { ...{ ont_pool_kit_barcode: obj.$event }, ...{ position: obj.position } }
    state.currentRun.flowcell_attributes.push(flowcell)
  }
}

const mutations = {
  setRuns: mutate('runs'),
  setInstrumentName: mutateRun('instrument_name'),
  setState: mutateRun('state'),
  setFlowcellId: setFlowcellId(),
  setPoolKitBarcode: setPoolKitBarcode(),
  setInstruments: mutate('instruments'),
  populatePools: mutate('pools'),
  setCurrentRun: mutate('currentRun'),
}

export default mutations
