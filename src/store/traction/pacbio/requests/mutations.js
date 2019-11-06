const mutations = {
  setRequests(state, requests) {
    state.requests = requests
  },
  setLibraryType(state, payload) {
    state.requests.filter(r => r.id === payload.requestId)[0].library_type = payload.libraryType
  },
}

export default mutations