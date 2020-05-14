module.exports = {
  Mutation: {
    updateFlowcell: (_, { position, libraryName }) => {
      return { position, libraryName }
    },
    buildCovidRun: (_, { runId, flowcells }) => {
      return { runId, flowcells }
    }
  }
}