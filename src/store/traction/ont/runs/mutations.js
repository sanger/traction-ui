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

const setPoolTubeBarcode = () => (state, obj) => {
  const exists = state.currentRun.flowcell_attributes.find(
    (flowcell) => flowcell.position == obj.position,
  )

  if (exists) {
    Vue.set(exists, 'tube_barcode', obj.barcode)
  } else {
    let flowcell = { ...{ tube_barcode: obj.barcode }, ...{ position: obj.position } }
    state.currentRun.flowcell_attributes.push(flowcell)
  }
}

const mutations = {
  setInstrumentName: mutateRun('instrument_name'),
  setState: mutateRun('state'),
  setFlowcellId: setFlowcellId(),
  setPoolTubeBarcode: setPoolTubeBarcode(),
  populatePools: mutate('pools'),
  setCurrentRun: mutate('currentRun'),
}

export default mutations
