// Useful imports for testing
import { mount, shallowMount, flushPromises, config } from '@vue/test-utils'

/*createPinia is for creating a Pinia instance to test pinia stores.
setActivePinia sets the newly created Pinia instance as the active Pinia instance. 
This is necessary to allow useStore to pick up the any other pinia instance other than default global instance
More documentation available on https://pinia.vuejs.org/cookbook/testing.html*/
import { setActivePinia, createPinia } from 'pinia'

//createTestingPinia is to mock a Pinia store while testing a component that uses Pinia store.
import { createTestingPinia } from '@pinia/testing'

import store from '@/store'
import Data from '@tests/data/'
import router from '@/router'
import { nextTick } from 'vue'
import globalAlert from '@/mixins/globalAlert'
import { components } from '@/components/shared'
import RequestFactory from './factoryHelper.js'

/* 
    This setups up a global config for all tests that use these methods
    Doing this here instead of in setup.js means we don't set global config for all tests
    This is useful for tests that don't use these methods and run in different environments
    e.g. tests/unit/lib/csv/pacbio.spec.js
*/
config.global.mixins = [globalAlert]
config.global.plugins = [router, store]
config.global.components = components

export {
  mount,
  store,
  Data,
  shallowMount,
  router,
  flushPromises,
  nextTick,
  setActivePinia,
  createPinia,
  createTestingPinia,
  RequestFactory,
}
