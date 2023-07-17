// Global setup to disable the vue console messages

import { vi, afterEach } from 'vitest'

vi.mock('swrv')
afterEach(() => {
  vi.clearAllMocks()
})
