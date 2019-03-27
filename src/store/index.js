import Vuex from 'vuex'
import Vue from 'vue'
import Api from '@/api'
import build from '@/api/ApiBuilder'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    api: build(Api.Config, process.env)
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    api: state => state.api
  }
})
