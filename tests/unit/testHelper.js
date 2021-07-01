import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '@/store'
import Data from '../data'
import router from '@/router'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(Vuex)

export { mount, localVue, Vuex, store, Data, shallowMount, router }
