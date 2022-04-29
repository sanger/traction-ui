const getters = {
  sampleExtractionTubeRequest: (state, getters, rootState) => rootState.api.sampleExtraction.assets,
  printJobV2Request: (state, getters, rootState) => rootState.api.printMyBarcodeV2.print_jobs,
  squixLabelTemplateName: (state) => state.squixLabelTemplateName,
  toshibaLabelTemplateName: (state) => state.toshibaLabelTemplateName,
}
export default getters
