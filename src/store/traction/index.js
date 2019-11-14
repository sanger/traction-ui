import saphyrModule from '@/store/traction/saphyr'
import pacbioModule from '@/store/traction/pacbio'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const traction = {
  namespaced: true,
  modules: {
    saphyr: saphyrModule,
    pacbio: pacbioModule
  },
  state,
  getters,
  mutations,
  actions
}

export default traction
