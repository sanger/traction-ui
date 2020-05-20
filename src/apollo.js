import Vue from 'vue'
import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'
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
});

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

const runQuery = gql`
  {
    run @client {
      id
      flowcells
    }
  }
`;

export const resolvers = {
  Query: {
    flowcell(_, { position }, { cache }) {
      const data = cache.readQuery({ query: runQuery })
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
      console.log("1")
      const data = cache.readQuery({ query: runQuery })
      data.run.id = id
      data.run.flowcells = flowcells
      cache.writeQuery({ query: runQuery, data })
      // return { run: data.run }
    },
    updateFlowcell(_, { position, libraryName }, { cache }) {
      const data = cache.readQuery({ query: runQuery })
      const currentFlowcell = data.run.flowcells.find(flowcell => flowcell.position === position)

      if (currentFlowcell) {
        currentFlowcell.library.name = libraryName
      } else {
        data.run.flowcells.push(
          {
            position: position,
            library: {
              name: libraryName
            }
          }
        )
      }

      cache.writeQuery({ query: runQuery, data })

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