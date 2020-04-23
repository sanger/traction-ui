const getters = {
    platesRequest: (state, getters, rootState) => rootState.api.traction.sequencescape.plates,
    plates: state => state.plates
}

export default getters