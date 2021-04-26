import Vue from 'vue'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'
import { InMemoryCache } from 'apollo-cache-inmemory'
import resolvers from '@/graphql/resolvers'

const cache = new InMemoryCache()

cache.writeData({
  data: {
    run: {
      __typename: 'Run',
      id: '',
      flowcells: [],
    },
    libraries: [],
  },
})

Vue.use(VueApollo)

const apolloClient = new ApolloClient({
  uri: process.env.VUE_APP_TRACTION_GRAPHQL_URL,
  cache,
  resolvers,
})

export const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})
