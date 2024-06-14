const getters = {
  tractionTubes: (state) => state.tractionTubes,
  tubeRequest: (state, getters, rootState) => rootState.api.v1.traction.saphyr.tubes,
  requestsRequest: (state, getters, rootState) => rootState.api.v1.traction.saphyr.requests,
  tractionTubesWithInfo: (state) =>
    state.tractionTubes.map((i) => Object.assign(i.material, { barcode: i.barcode })),
  libraryRequest: (state, getters, rootState) => rootState.api.v1.traction.saphyr.libraries,
  libraries: (state) => state.libraries,
}

export default getters
