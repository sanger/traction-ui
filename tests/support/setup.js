// Global setup to disable the vue console messages

import Vue from 'vue'
import { vi, afterEach } from 'vitest'

Vue.config.productionTip = false
Vue.config.devtools = false

vi.mock('swrv')
afterEach(() => {
  vi.clearAllMocks()
})
