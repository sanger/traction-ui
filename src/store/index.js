import Vuex from 'vuex'
import Vue from 'vue'
import Api from '@/api'
import build from '@/api/ApiBuilder'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api: build(Api.Config, process.env),
    printers: ['printer1', 'printer2', 'printer3']
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    api: state => state.api,
    printers: state => state.printers
  }
})
