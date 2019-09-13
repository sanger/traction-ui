import Vuex from 'vuex'
import Vue from 'vue'
import Api from '@/api'
import build from '@/api/ApiBuilder'
import PrinterList from '@/config/PrinterList'
import traction from '@/store/traction/index'
import sequencescape from '@/store/sequencescape/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api: build(Api.Config, process.env),
    printers: PrinterList,
    labelTemplateId: process.env.VUE_APP_LABEL_TEMPLATE_ID,
  },
  getters: {
    api: state => state.api,
    printers: state => state.printers,
    labelTemplateId: state => state.labelTemplateId,
  },
  modules: {
    traction,
    sequencescape
  }
})
