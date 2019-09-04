import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import store from '@/store'

const localVue = createLocalVue()
localVue.use(BootstrapVue)
localVue.use(VueRouter)
localVue.use(Vuex)

export { mount, localVue, Vuex, store }
