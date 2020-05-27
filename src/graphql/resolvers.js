import GET_CLIENT_RUN from '@/graphql/queries/client/GetClientRun.query.gql'

export default {
  Mutation: {
    // Could move setRun for both new and existing run here ..
    // login: async (_, { id, flowcells }, { dataSources }) => {
    //   const user = await dataSources.userAPI.findOrCreateUser({ email });
    //   if (user) return Buffer.from(email).toString('base64');
    // },
    setRun(_, { id, flowcells }, { cache }) {
      const data = cache.readQuery({ query: GET_CLIENT_RUN })
      data.run.id = id
      data.run.flowcells = flowcells
      cache.writeQuery({ query: GET_CLIENT_RUN, data })
      return { id, flowcells }
    },
    updateFlowcell(_, { position, libraryName }, { cache }) {
      const data = cache.readQuery({ query: GET_CLIENT_RUN })
      const currentFlowcell = data.run.flowcells.find(flowcell => flowcell.position === position)

      if (currentFlowcell) {
        currentFlowcell.library.name = libraryName
      } else {
        data.run.flowcells.push({ position: position, library: { name: libraryName } })
      }

      cache.writeQuery({ query: GET_CLIENT_RUN, data })
      return { position, libraryName }
    }
  }
} 