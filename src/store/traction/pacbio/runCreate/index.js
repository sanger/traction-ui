/*
  This is to replace the run store
  It will make sense to slowly move over
  The run store itself is a bit broken
  Vuex Store configuration
  Usage:
    import Vuex from 'vuex'
    import storeConfig from './store/store'
    Vue.use(Vuex)

    const store = new Vuex.Store(storeConfig)
    new Vue({
      ...,
      store
    })
*/
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import state from './state'

const runCreate = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}

export default runCreate
