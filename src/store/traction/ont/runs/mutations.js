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
    exists.flowcell_id = obj.$event
  } else {
    let flowcell = { ...{ flowcell_id: obj.$event }, ...{ position: obj.position } }
    state.currentRun.flowcell_attributes.push(flowcell)
  }
}

const mutations = {
  setRuns: mutate('runs'),
  setCurrentRun: mutate('currentRun'),
  setInstrumentName: mutateRun('instrument_name'),
  setState: mutateRun('state'),
  setFlowcellId: setFlowcellId(),
}

export default mutations
