import Vuex from 'vuex'
import Vue from 'vue'
import Api from '@/api'
import build from '@/api/ApiBuilder'
import PrinterList from '@/config/PrinterList'
import traction from '@/store/traction'
import sampleExtraction from '@/store/sampleExtraction'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api: build(Api.Config, process.env),
    printers: PrinterList,
    pipeline: ''
  },
  mutations: {
    setPipeline(state, pipeline) {
      state.pipeline = pipeline
    }
  },
  getters: {
    api: state => state.api,
    printers: state => state.printers,
    pipeline: state => state.pipeline
  },
  modules: {
    traction,
    sampleExtraction
  }
})
