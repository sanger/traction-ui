import './styles/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registerGlobal } from '@/components/shared'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { OktaAuth } from '@okta/okta-auth-js'
import OktaVue from '@okta/okta-vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const oktaAuth = new OktaAuth({
  issuer: `https://${oktaDomain}`,
  clientId: clientId,
  redirectUri: window.location.origin + '/#/login/callback',
  scopes: ['openid', 'profile', 'email'],
})

const app = createApp(App)
registerGlobal(app)
app.use(router)
app.use(OktaVue, { oktaAuth })
app.use(pinia)
app.mount('#app')
