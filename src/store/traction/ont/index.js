import ontRunsModule from '@/store/traction/ont/runs'
import pools from '@/store/traction/ont/pools'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const ont = {
  namespaced: true,
  modules: {
    runs: ontRunsModule,
    pools,
  },
  getters,
  mutations,
  actions,
  state,
}

export default ont
