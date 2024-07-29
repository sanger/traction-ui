const getters = {
  getPlates: (state, getters, rootState) => rootState.api.v2.traction.pacbio.plates,
  plates: (state) => Object.values(state.plates),
}

export default getters
