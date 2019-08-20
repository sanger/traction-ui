import Vuex from 'vuex'
import Vue from 'vue'
import Api from '@/api'
import build from '@/api/ApiBuilder'
import PrinterList from '@/config/PrinterList'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api: build(Api.Config, process.env),
    printers: PrinterList,
    labelTemplateId: process.env.VUE_APP_LABEL_TEMPLATE_ID,
    runs: {},
    libraries: {},
    tubes: {}
  },
  mutations: {
    addRun (state, run) {
      state.runs[run.id] = run
    },
    addLibrary (state, library) {
      state.libraries[library.id] = library
    },
    addTube (state, tube) {
      state.tubes[tube.id] = tube
    },
    addRuns (state, runs) {
      for (let run of runs) {
        this.commit('addRun', run)
      }
    },
    addLibraries (state, libraries) {
      for (let library of libraries) {
        this.commit('addLibrary', library)
      }
    },
    addTubes (state, tubes) {
      for (let tube of tubes) {
        this.commit('addTube', tube)
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
    },
    libraries: state => state.libraries,
    library: state => (id) => {
      return state.libraries[id]
    },
    tubes: state => state.tubes,
    tube: state => (id) => {
      return state.tube[id]
    }
  }
})
