import { id } from "postcss-selector-parser"

const mutations = {
  setTubes (state, tubes) {
    state.tractionTubes = tubes
  },
  setLibraries(state, libraries) {
    state.libraries = libraries
  },
  setLibrary(state, library) {
    let lib = state.libraries.find((lib => lib.id === library.id))
    state.libraries[lib] = library
    // loop through the libraries, find for id, upadte
  }
}

export default mutations
