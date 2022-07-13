import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import store from './store'
import globalAlert from '@/mixins/globalAlert'
// Vue 2.7 (and 3) includes the composition API, so can remove this shortly.
import VueCompositionAPI from '@vue/composition-api'
import './styles/index.css'

import { registerGlobal } from '@/components/shared'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.mixin(globalAlert)
// Vue 2.7 (and 3) includes the composition API, so can remove this shortly.
Vue.use(VueCompositionAPI)

registerGlobal(Vue)

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app')
