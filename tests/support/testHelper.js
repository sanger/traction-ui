// Useful imports for testing
import { mount, shallowMount, flushPromises, config } from '@vue/test-utils'
import store from '@/store'
import Data from '@tests/data'
import router from '@/router'
import { nextTick } from 'vue'
import globalAlert from '@/mixins/globalAlert'
import { components } from '@/components/shared'

/* 
    This setups up a global config for all tests that use these methods
    Doing this here instead of in setup.js means we don't set global config for all tests
    This is useful for tests that don't use these methods and run in different environments
    e.g. tests/unit/lib/csv/pacbio.spec.js
*/

config.global.mixins = [globalAlert]
config.global.plugins = [router, store]
config.global.components = components

export { mount, store, Data, shallowMount, router, flushPromises, nextTick }
