const getters = {
  printJobRequest: (state, getters, rootState) => rootState.api.printMyBarcode.print_jobs,
  tubeLabelTemplateName: (state) => state.tubeLabelTemplateName,
}
export default getters
