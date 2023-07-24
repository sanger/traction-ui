// Useful imports for testing
import { mount, shallowMount, flushPromises } from '@vue/test-utils'
import store from '@/store'
import Data from '@tests/data'
import router from '@/router'
import { nextTick } from 'vue'

export { mount, store, Data, shallowMount, router, flushPromises, nextTick }
