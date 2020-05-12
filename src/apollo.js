import Vue from 'vue'
import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'
import gql from 'graphql-tag'
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache();

Vue.use(VueApollo)

const typeDefs = gql`
  type Run {
    id: Int!
    flowcells: [Flowcell]
  }

  type Flowcell {
    position: Int
    barcode: String
  }

  type Mutation {
    updateFlowcell(position: Int, barcode: String): Flowcell
  }
`

const flowcells = () => {
  let flowcells = []

  for (let position of [1,2,3,4,5]) {
    flowcells.push({
      __typename: "Flowcell",
      position: position,
      barcode: '',
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
    updateFlowcell: (_, { position, barcode }, { cache }) => {
      const data = cache.readQuery({ query: ONT_HERON_RUN_QUERY })
      const currentFlowcell = data.run.flowcells.find(flowcell => flowcell.position === position)
      currentFlowcell.barcode = barcode
      cache.writeQuery({ query: ONT_HERON_RUN_QUERY, data })
      return currentFlowcell
    },
  }
}

const apolloClient = new ApolloClient({
  uri: process.env.VUE_APP_TRACTION_GRAPHQL_URL,
  cache,
  typeDefs,
  resolvers,
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

export default apolloProvider