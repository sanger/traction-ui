const getters = {
  libraryRequest: (state, getters, rootState) => rootState.api.traction.pacbio.libraries,
  requestLibraryRequest: (state, getters, rootState) =>
    rootState.api.traction.pacbio.request_library,
  libraries: (state) => state.libraries,
  // Returns a list of tagSet options
  tagSetChoices: (state) => {
    return state.tagSetChoices
  },
  // Returns a list of tag options by tagSetId
  tagChoices: (state) => (tagSetId) => {
    return state.tagChoices[tagSetId] || []
  },
}

export default getters
