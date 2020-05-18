module.exports = {
  Mutation: {
    updateFlowcell: (_, { position, libraryName }) => {
      return { position, libraryName }
    },
    buildCovidRun: (_, { runId, flowcells }) => {
      return { runId, flowcells }
    }
  },
  Query: {
    run(root, id, context, info) {
      console.log(id)
      console.log(context)
      console.log(info)
      return { root }
    }
  }
}