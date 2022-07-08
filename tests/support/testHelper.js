import BootstrapVue from 'bootstrap-vue'
import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
import store from '@/store'
import Data from '@tests/data'
import router from '@/router'
import globalAlert from '@/mixins/globalAlert'
import VueCompositionAPI from '@vue/composition-api'
import { registerGlobal } from '@/components/shared'

const localVue = createLocalVue()

localVue.use(BootstrapVue)
localVue.mixin(globalAlert)
localVue.use(VueCompositionAPI)

registerGlobal(localVue)

export { mount, localVue, store, Data, shallowMount, router }
