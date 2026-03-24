import './styles/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registerGlobal } from '@/components/shared'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import OktaVue from '@okta/okta-vue'
import oktaAuth from '@/lib/auth'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
registerGlobal(app)
app.use(router)
app.use(OktaVue, { oktaAuth })
app.use(pinia)
app.mount('#app')
