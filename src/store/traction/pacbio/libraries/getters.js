const getters = {
  libraryRequest:  (state, getters, rootState) => rootState.api.traction.pacbio.libraries,
  libraries: state => state.libraries
}

export default getters
