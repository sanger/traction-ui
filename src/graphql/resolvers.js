import GET_CLIENT_RUN from '@/graphql/queries/client/GetClientRun.query.gql'
import GET_CLIENT_LIBRARIES from '@/graphql/queries/client/GetClientLibraries.query.gql'

export default {
  Mutation: {
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
        data.run.flowcells.push(
          { 
            __typename: 'Flowcell', 
            position: position, 
            library: { 
              __typename: 'Library', 
              name: libraryName 
            } 
          }
        )
      }

      cache.writeQuery({ query: GET_CLIENT_RUN, data })
      return { position, libraryName }
    },
    setLibraries(_, { libraries }, { cache }) {
      const data = cache.readQuery({ query: GET_CLIENT_LIBRARIES })
      data.libraries = libraries
      cache.writeQuery({ query: GET_CLIENT_LIBRARIES, data })
      return { libraries }
    },
    updateLibrariesList(_, { assignedToFlowcell, libraryName }, { cache } ) {
      const data = cache.readQuery({ query: GET_CLIENT_LIBRARIES })
      let currentLibrary = data.libraries.find(library => library.name == libraryName)
      currentLibrary.assignedToFlowcell = assignedToFlowcell
      cache.writeQuery({ query: GET_CLIENT_LIBRARIES, data })
      return { assignedToFlowcell, libraryName }
    }
  }
} 