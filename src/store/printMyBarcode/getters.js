const getters = {
  printJobRequest: (state, getters, rootState) => rootState.api.v1.printMyBarcode.print_jobs,
  tubeLabelTemplateName: (state) => state.tubeLabelTemplateName,
}
export default getters
