import VueRouter from 'vue-router'
import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/store'
import Data from '@tests/data'
import router from '@/router'
import globalAlert from '@/mixins/globalAlert'
import { registerGlobal } from '@/components/shared'

const localVue = createLocalVue()

localVue.use(VueRouter)
localVue.mixin(globalAlert)

registerGlobal(localVue)

export { mount, localVue, store, Data, shallowMount, router }
