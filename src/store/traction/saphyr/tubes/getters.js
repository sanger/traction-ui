const getters = {
  tractionTubes: (state) => state.tractionTubes,
  tubeRequest: (state, getters, rootState) => rootState.api.traction.saphyr.tubes,
  requestsRequest: (state, getters, rootState) => rootState.api.traction.saphyr.requests,
  tractionTubesWithInfo: (state) =>
    state.tractionTubes.map((i) => Object.assign(i.material, { barcode: i.barcode })),
  libraryRequest: (state, getters, rootState) => rootState.api.traction.saphyr.libraries,
  libraries: (state) => Object.values(state.libraries),
}

export default getters
