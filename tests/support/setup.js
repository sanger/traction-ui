// Global setup to disable the vue console messages

import { vi, afterEach } from 'vitest'

// https://vitest.dev/api/vi.html#vi-mock
vi.mock('swrv')
vi.mock('axios')

afterEach(() => {
  vi.clearAllMocks()
})
