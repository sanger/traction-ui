import Vuex from 'vuex'
import Vue from 'vue'
import Api from '@/api'
import build from '@/api/ApiBuilder'
import PrinterList from '@/config/PrinterList'
import saphyrModule from '@/store/saphyr/saphyrModule'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api: build(Api.Config, process.env),
    printers: PrinterList,
    labelTemplateId: process.env.VUE_APP_LABEL_TEMPLATE_ID,
    runs: {}
  },
  mutations: {
    addRun (state, run) {
      state.runs[run.id] = run
    },
    addRuns (state, runs) {
      for (let run of runs) {
        this.commit('addRun', run)
      }
    },
    clearRuns (state) {
      state.runs = {}
    }
  },
  actions: {
  },
  getters: {
    api: state => state.api,
    printers: state => state.printers,
    labelTemplateId: state => state.labelTemplateId,
    runs: state => state.runs,
    run: state => (id) => {
      return state.runs[id]
    }
  },
  modules: {
    saphyr: saphyrModule
  }
})
