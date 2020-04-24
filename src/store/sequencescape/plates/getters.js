const getters = {
    platesRequest: (state, getters, rootState) => rootState.api.sequencescape.plates,
    plates: state => state.plates
}

export default getters