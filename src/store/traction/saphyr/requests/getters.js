const getters = {
    requests: state => state.requests,
    requestsRequest: (state, getters, rootState) => rootState.api.traction.saphyr.requests,
}

export default getters