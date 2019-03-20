import Vuex from 'vuex';
import Vue from 'vue';
import Api from '@/api'
import buildRequestHelper from '@/api/BuildRequest'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    traction: buildRequestHelper(Api.Config.traction),
    sequencescape: buildRequestHelper(Api.Config.sequencescape),
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    sequencescape: state => state.sequencescape,
    traction: state => state.traction,
  }
})
