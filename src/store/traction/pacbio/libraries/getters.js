const getters = {
  libraryRequest: (state, getters, rootState) => rootState.api.traction.pacbio.libraries,
  requestLibraryRequest: (state, getters, rootState) =>
    rootState.api.traction.pacbio.request_library,
  libraries: (state) => state.libraries,
  libraryByBarcode: (state) => (barcode) => {
    return state.libraries.find((library) => library.tube.barcode === barcode)
  },
}

export default getters
