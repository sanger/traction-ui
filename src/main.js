import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import store from './store';
import BootstrapVue from 'bootstrap-vue'
import { apolloProvider } from './graphql/client'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(Vuex)

new Vue({
  store,
  router,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
