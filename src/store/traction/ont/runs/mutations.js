const mutate = (key) => (state, val) => {
  state[key] = val
}

const mutations = {
  setRuns: mutate('runs'),
  setCurrentRun: mutate('currentRun'),
}

export default mutations
