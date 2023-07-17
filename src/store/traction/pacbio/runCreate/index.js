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
