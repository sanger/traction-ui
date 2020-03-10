
const mutations = {
  setTubes (state, tubes) {
    state.tractionTubes = tubes
  },
  setLibraries(state, libraries) {
    state.libraries = libraries
  },
  updateLibrary(state, library) {
    let index = state.libraries.indexOf(lib => lib.id === library.id)
    let libraries = state.libraries.splice(index, 1, library)
    state.libraries = libraries
  }
}

export default mutations
