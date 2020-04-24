const getters = {
    sequencescapePlatesRequest: (state, getters, rootState) => rootState.api.sequencescape.plates,
    sequencescapePlates: state => state.sequencescapePlates
}

export default getters