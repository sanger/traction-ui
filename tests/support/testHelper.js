import { createApp } from 'vue'
import { mount, shallowMount } from '@vue/test-utils'
import store from '@/store'
import Data from '@tests/data'
import router from '@/router'
import globalAlert from '@/mixins/globalAlert'
import { registerGlobal } from '@/components/shared'

const localVue = createApp()
registerGlobal(localVue)
localVue.use(router)
localVue.mixin(globalAlert)

export { mount, localVue, store, Data, shallowMount, router }
