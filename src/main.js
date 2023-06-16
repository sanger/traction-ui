import './styles/index.css'

import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router'
import store from './store'
import globalAlert from '@/mixins/globalAlert'

import { registerGlobal } from '@/components/shared'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.mixin(globalAlert)

registerGlobal(Vue)

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app')
