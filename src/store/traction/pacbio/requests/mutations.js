const mutations = {
  setRequests(state, requests) {
    state.requests = requests
  },
  setLibraryType(state, payload) {
    state.requests.filter(r => r.id === payload.requestId)[0].library_type = payload.libraryType
  },
  setEstimateOfGBRequired(state, payload) {
    state.requests.filter(r => r.id === payload.requestId)[0].estimate_of_gb_required = payload.estimateOfGBRequired
  },
  setNumberOfSMRTCells(state, payload) {
    state.requests.filter(r => r.id === payload.requestId)[0].number_of_smrt_cells = payload.numberOfSMRTCells
  },
  setCostCode(state, payload) {
    state.requests.filter(r => r.id === payload.requestId)[0].cost_code = payload.costCode
  }
}

export default mutations