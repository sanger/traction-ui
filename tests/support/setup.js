// Global setup to disable the vue console messages

import { vi, afterEach } from 'vitest'
import  { config } from '@vue/test-utils'
import globalAlert from '@/mixins/globalAlert'
import router from '@/router'
import store from '@/store'
import { components } from '@/components/shared'

config.global.mixins = [globalAlert]
config.global.plugins = [router, store]
config.global.components = components

// https://vitest.dev/api/vi.html#vi-mock
vi.mock('swrv')
vi.mock('axios')

afterEach(() => {
  vi.clearAllMocks()
})
