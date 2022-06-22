import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/store'
import Data from '@tests/data'
import router from '@/router'
import globalAlert from '@/mixins/globalAlert'

const localVue = createLocalVue()

localVue.use(BootstrapVue)
localVue.mixin(globalAlert)

export { mount, localVue, store, Data, shallowMount, router }
