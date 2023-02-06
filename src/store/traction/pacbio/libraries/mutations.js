const mutations = {
  setLibraries(state, libraries) {
    state.libraries = libraries
  },
  updateLibrary(state, library) {
    let index = state.libraries.findIndex((lib) => lib.id == library.id)
    let libraries = state.libraries
    libraries.splice(index, 1, library)
    state.libraries = libraries
  },
  // Set tagSetOptions and tagOptions together
  setTagSetChoices(state, { tagSetChoices, tagChoices }) {
    state.tagSetChoices = tagSetChoices
    state.tagChoices = tagChoices
  },
}

export default mutations
