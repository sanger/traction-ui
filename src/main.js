import './styles/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import globalAlert from '@/mixins/globalAlert'

import { registerGlobal } from '@/components/shared'

const app = createApp(App)
app.use(store)
app.use(router)
app.mixin(globalAlert)

app.mount("#app");
registerGlobal(app)

