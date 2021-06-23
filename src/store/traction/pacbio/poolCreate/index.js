
/*
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
import actions from "./actions"
import mutations from "./mutations"
import getters from "./getters"
import state from "./state"

const store = {
  state,
  mutations,
  actions,
  getters,
};

export default store;
