const getters = {
  sampleExtractionTubeRequest: (state, getters, rootState) => rootState.api.sampleExtraction.assets,
  printJobV2Request: (state, getters, rootState) => rootState.api.printMyBarcodeV2.print_jobs,
  tubeLabelTemplateName: (state) => state.tubeLabelTemplateName,
}
export default getters
