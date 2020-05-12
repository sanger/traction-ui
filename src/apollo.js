import Vue from 'vue'
import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'
import gql from 'graphql-tag'
import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache();

Vue.use(VueApollo)

export const typeDefs = gql`
  type Run {
    text: String!
  }

  type Mutation {
    updateRunText(text: String!): Run
  }
`

cache.writeData({
  data: {
    run: {
      __typename: 'Run',
      id: 123,
      text: 'before',
    },
  },
});

import ONT_HERON_RUN_QUERY from '@/graphql/client/queries/OntHeronRun.query.gql'

const resolvers = {
  Mutation: {
    updateRunText: (_, { text }, { cache }) => {
      const data = cache.readQuery({ query: ONT_HERON_RUN_QUERY })
      const currentItem = data.run
      currentItem.text = text
      cache.writeQuery({ query: ONT_HERON_RUN_QUERY, data })
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