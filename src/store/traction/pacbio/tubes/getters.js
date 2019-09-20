const getters = {
  tractionTubes:   state => state.tractionTubes,
  tubeRequest:     (state, getters, rootState) => rootState.api.traction.pacbio.tubes,
  requestsRequest: (state, getters, rootState) => rootState.api.traction.pacbio.requests,
  tractionTubesWithInfo:   state => state.tractionTubes.map(i => Object.assign(i.material, {barcode: i.barcode})),
  libraryRequest:  (state, getters, rootState) => rootState.api.traction.pacbio.libraries,
}

export default getters
