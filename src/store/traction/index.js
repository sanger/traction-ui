import state from './state'
import getters from './getters'
import mutations from './mutations'

const traction = {
  namespaced: true,
  state,
  getters,
  mutations,
}

export default traction
