const getters = {
  libraryRequest:  (state, getters, rootState) => rootState.api.traction.pacbio.libraries,
  libraries: state => state.libraries,
  libraryByBarcode: state => (barcode) => {
    return state.libraries.find(library => library.barcode === barcode)
  }}

export default getters
