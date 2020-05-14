import Vue from 'vue'
import ApolloClient from 'apollo-boost'
import VueApollo from 'vue-apollo'
import { InMemoryCache } from 'apollo-cache-inmemory'
import resolvers from '@/graphql/resolvers/resolvers'

const cache = new InMemoryCache()

Vue.use(VueApollo)

const apolloClient = new ApolloClient({
  uri: process.env.VUE_APP_TRACTION_GRAPHQL_URL,
  cache,
  resolvers,
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

export default apolloProvider