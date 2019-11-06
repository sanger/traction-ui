const getters = {
    requests: state => state.requests,
    requestsRequest: (state, getters, rootState) => rootState.api.traction.pacbio.requests,
}

export default getters