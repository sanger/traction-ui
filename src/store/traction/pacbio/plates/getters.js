const getters = {
  getPlates: (state, getters, rootState) => {
    debugger
    return rootState.api.v2.tractionv2.pacbio.plates
  },
  plates: (state) => Object.values(state.plates),
}

export default getters
