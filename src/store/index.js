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
    runs: {},
    libraries: {},
    requests: {}
  },
  mutations: {
    addRun (state, run) {
      state.runs[run.id] = run
    },
    addLibrary (state, library) {
      state.libraries[library.id] = library
    },
    addRequest (state, request) {
      state.requests[request.id] = request
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
    addRequests (state, requests) {
      for (let request of requests) {
        this.commit('addRequest', request)
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
    requests: state => state.requests,
    request: state => (id) => {
      return state.requests[id]
    }
  },
  modules: {
    traction,
    sequencescape
  }
})
