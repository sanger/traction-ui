import ont from '@/store/traction/ont'
import state from './state'
import getters from './getters'
import mutations from './mutations'

const traction = {
  namespaced: true,
  modules: {
    ont,
  },
  state,
  getters,
  mutations,
}

export default traction
