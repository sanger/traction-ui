import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/store'
import Data from '@tests/data'
import router from '@/router'

const localVue = createLocalVue()
localVue.use(BootstrapVue)

export { mount, localVue, store, Data, shallowMount, router }
