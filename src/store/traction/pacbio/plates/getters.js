const getters = {
  getPlates: (state, getters, rootState) => rootState.api.traction.pacbio.plates,
  plates: (state) => Object.values(state.plates),
}

export default getters
