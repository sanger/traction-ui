import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import store from './store';
import BootstrapVue from 'bootstrap-vue'
import VueApollo from 'vue-apollo'
import ApolloClient from 'apollo-boost'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(Vuex)
Vue.use(VueApollo)

const apolloClient = new ApolloClient({
  uri: process.env.VUE_APP_TRACTION_GRAPHQL_URL
})

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

new Vue({
  store,
  router,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
