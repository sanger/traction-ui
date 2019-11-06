const getters = {
    requests: state => state.requests,
    request: state => (id) => {
        return state.requests.find(s => s.id === id)
    },
    requestsRequest: (state, getters, rootState) => rootState.api.traction.pacbio.requests,
}

export default getters