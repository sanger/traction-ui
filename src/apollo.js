import Vue from 'vue'
import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'
import gql from 'graphql-tag'

const cache = new InMemoryCache()

Vue.use(VueApollo)

let schema = gql`
  type Flowcell {
    position: Integer
    libraryName: String!
  }

  type Run {
    id: ID!
    flowcells: [Flowcell!]!
  }

  type Query {
    run: Run
  }

  type Mutation {
    setRun(id: ID!, flowcells: [Flowcell!]!): Run
    updateFlowcell(position: Integer!, libraryName: String!): Flowcell
  }

  schema {
    query: Query
    mutation: Mutation
  }
`

export const resolvers = {
  Query: {
    run() {
      return { id: '', flowcells: [{ position: '', library: { name: '' } }]}
    },
  },
  Mutation: {
    setRun(_, { id, flowcells }) {
      return { id, flowcells }
    },
    updateFlowcell(_, { position, libraryName }) {
      return { position, libraryName }
    },
  },
}

const apolloClient = new ApolloClient({
  uri: process.env.VUE_APP_TRACTION_GRAPHQL_URL,
  cache,
  schema,
  resolvers,
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

export default apolloProvider