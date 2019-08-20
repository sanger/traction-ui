import actions from './actions'

const sequencescape = {
  namespaced: true,
  state: {
    sequencescapeTubes: []
  },
  getters: {
    sequencescapeTubeRequest: (state, getters, rootState) => rootState.api.sequencescape.tubes,
    sequencescapeTubes: state => state.sequencescapeTubes
  },
  mutations: {
    setSequencescapeTubes (state, sequencescapeTubes) {
      state.sequencescapeTubes = sequencescapeTubes
    }
  },
  actions
}

export default sequencescape
