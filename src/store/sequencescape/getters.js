const getters = {
  sequencescapeTubeRequest: (state, getters, rootState) => rootState.api.sequencescape.tubes,
  sequencescapeTubes: state => state.sequencescapeTubes
}

export default getters
