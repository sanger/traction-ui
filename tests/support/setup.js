// Global setup to disable the vue console messages

import { vi, afterEach } from 'vitest'
import  { config } from '@vue/test-utils'
import globalAlert from '@/mixins/globalAlert'
import router from '@/router'
import store from '@/store'

config.global.mixins = globalAlert
config.global.plugins = [
  router,
  store
]

vi.mock('swrv')
afterEach(() => {
  vi.clearAllMocks()
})
