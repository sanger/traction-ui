const getters = {
  getPlates: (state, getters, rootState) => rootState.api.traction.pacbio.plates,
  plates: (state) => state.plates,
}

export default getters
