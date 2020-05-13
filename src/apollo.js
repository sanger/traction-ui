import Vue from 'vue'
import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache();

Vue.use(VueApollo)

const flowcells = () => {
  let flowcells = []

  for (let position of [1,2,3,4,5]) {
    flowcells.push({
      __typename: "Flowcell",
      position: position,
      libraryName: '',
    })
  }
  return flowcells
}

cache.writeData({
  data: {
    run: {
      __typename: 'Run',
      id: 'new',
      flowcells: flowcells(),
    },
  },
})

import ONT_HERON_RUN_QUERY from '@/graphql/client/queries/OntHeronRun.query.gql'

const resolvers = {
  Mutation: {
    // Timeboxed trying to move this to to component
    updateFlowcell: (_, { position, libraryName }, { cache }) => {
      const data = cache.readQuery({ query: ONT_HERON_RUN_QUERY })
      const currentFlowcell = data.run.flowcells.find(flowcell => flowcell.position === position)
      currentFlowcell.libraryName = libraryName
      cache.writeQuery({ query: ONT_HERON_RUN_QUERY, data })
      return currentFlowcell
    }
  }
}

const apolloClient = new ApolloClient({
  uri: process.env.VUE_APP_TRACTION_GRAPHQL_URL,
  cache,
  resolvers,
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

export default apolloProvider