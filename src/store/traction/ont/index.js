import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const ont = {
  namespaced: true,
  getters,
  mutations,
  actions,
  state,
}

export default ont
