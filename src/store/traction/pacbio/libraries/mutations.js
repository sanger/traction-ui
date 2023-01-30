const mutations = {
  setLibraries(state, libraries) {
    state.libraries = libraries
  },
  updateLibrary(state, library) {
    const index = state.libraries.findIndex((lib) => lib.id == library.id)
    const libraries = state.libraries
    libraries.splice(index, 1, library)
    state.libraries = libraries
  },
}

export default mutations
