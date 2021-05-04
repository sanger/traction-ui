const getters = {
  sampleExtractionTubeRequest: (state, getters, rootState) => rootState.api.sampleExtraction.assets,
  sampleExtractionTubes: (state) => state.sampleExtractionTubes,
}

export default getters
