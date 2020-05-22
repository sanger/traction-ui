module.exports = {
  Mutation: {
    updateFlowcell: (_, { position, libraryName }) => {
      return { position, libraryName }
    },
    buildOntRun: (_, { runId, flowcells }) => {
      return { runId, flowcells }
    }
  },
}