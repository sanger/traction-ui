import Vue from 'vue'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory'
import GET_CLIENT_RUN from '@/graphql/queries/client/GetClientRun.query.gql'
import gql from 'graphql-tag'

const cache = new InMemoryCache()

cache.writeData({
  data: {
    run:
      {
        __typename: 'Run',
        id: '',
        flowcells: []
      },
  },
})

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
    flowcell(position: Integer!): String
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
    flowcell(_, { position }, { cache }) {
      const data = cache.readQuery({ query: GET_CLIENT_RUN })
      let fc = data.run.flowcells.filter(fc => fc.position === position)[0]
      let libraryName = ''
      if (fc) {
        libraryName = fc.library.name
      }
      return libraryName
    }
  },
  Mutation: {
    setRun(_, { id, flowcells }, { cache }) {
      const data = cache.readQuery({ query: GET_CLIENT_RUN })
      data.run.id = id
      data.run.flowcells = flowcells
      cache.writeQuery({ query: GET_CLIENT_RUN, data })
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
    },
  },
}

const apolloClient = new ApolloClient({
  uri: process.env.VUE_APP_TRACTION_GRAPHQL_URL,
  cache,
  schema,
  resolvers,
})

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})
