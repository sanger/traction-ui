import GET_CLIENT_RUN from '@/graphql/queries/client/GetClientRun.query.gql'

export default {
  // Query: {
  //   libraryName(_, { position }, { cache }) {
  //     console.log("!!! #6 resolver libraryName")
  //     const data = cache.readQuery({ query: GET_CLIENT_RUN })
  //     let fc = data.run.flowcells.filter(fc => fc.position === position)[0]
  //     let libraryName = ''
  //     if (fc) {
  //       libraryName = fc.library.name
  //     }
  //     return libraryName
  //   }
  // },
  Mutation: {
    setRun(_, { id, flowcells }, { cache }) {
      console.log("!!! resolver setRun")
      const data = cache.readQuery({ query: GET_CLIENT_RUN })
      data.run.id = id
      data.run.flowcells = flowcells
      cache.writeQuery({ query: GET_CLIENT_RUN, data })
    },
    updateFlowcell(_, { position, libraryName }, { cache }) {
      console.log("!!! #8 resolver updateFlowcell")
      const data = cache.readQuery({ query: GET_CLIENT_RUN })
      const currentFlowcell = data.run.flowcells.find(flowcell => flowcell.position === position)

      if (currentFlowcell) {
        currentFlowcell.library.name = libraryName
      } else {
        data.run.flowcells.push({ position: position, library: { name: libraryName } })
      }

      cache.writeQuery({ query: GET_CLIENT_RUN, data })
    }
  }
}