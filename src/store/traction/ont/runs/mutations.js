const mutate = (key) => (state, val) => {
  state[key] = val
}

const mutateRun = (key) => (state, val) => {
  state.currentRun[key] = val
}

const mutations = {
  setRuns: mutate('runs'),
  setCurrentRun: mutate('currentRun'),
  setInstrumentName: mutateRun('instrument_name'),
  setCurrentState: mutateRun('current_state'),
}

export default mutations
