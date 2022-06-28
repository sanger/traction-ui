import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import globalAlert from '@/mixins/globalAlert'
import FlaggedFeature from '@/components/shared/FlaggedFeature'
// Vue 2.7 (and 3) includes the composition API, so can remove this shortly.
import VueCompositionAPI from '@vue/composition-api'
import './styles/index.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue)
Vue.use(Vuex)
Vue.mixin(globalAlert)
// Vue 2.7 (and 3) includes the composition API, so can remove this shortly.
Vue.use(VueCompositionAPI)

Vue.component('FlaggedFeature', FlaggedFeature)

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app')
