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

const resolvers = {
  Mutation: {
    updateFlowcell: (_, { position, libraryName }) => {
      return { position, libraryName }
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