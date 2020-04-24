import Vuex from 'vuex'
import Vue from 'vue'
import Api from '@/api'
import build from '@/api/ApiBuilder'
import PrinterList from '@/config/PrinterList'
import traction from '@/store/traction'
import sampleExtraction from '@/store/sampleExtraction'
import sequencescape from '@/store/sequencescape'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api: build(Api.Config, process.env),
    printers: PrinterList,
  },
  mutations: {
  },
  getters: {
    api: state => state.api,
    printers: state => state.printers,
  },
  modules: {
    traction,
    sampleExtraction,
    sequencescape
  }
})
