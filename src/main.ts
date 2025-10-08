import './styles/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { registerGlobal } from './components/shared'
import { createPinia } from 'pinia'

const app = createApp(App)
registerGlobal(app)
app.use(router)
app.use(createPinia())
app.mount('#app')
