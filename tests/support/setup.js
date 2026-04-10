// Global setup to disable the vue console messages

import { vi, afterEach } from 'vitest'

/*createPinia is for creating a Pinia instance to test pinia stores.
setActivePinia sets the newly created Pinia instance as the active Pinia instance.
This is necessary to allow useStore to pick up the any other pinia instance other than default global instance
More documentation available on https://pinia.vuejs.org/cookbook/testing.html*/
import { setActivePinia, createPinia } from 'pinia'

const oktaNavigationGuardMock = vi.hoisted(() => vi.fn(() => true))

// Mock the Okta Vue plugin to prevent actual navigation guard logic from running during tests
vi.mock('@okta/okta-vue', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    navigationGuard: oktaNavigationGuardMock,
  }
})

beforeEach(() => {
  setActivePinia(createPinia())
})

afterEach(() => {
  vi.clearAllMocks()
})
