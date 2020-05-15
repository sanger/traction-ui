import saphyrModule from '@/store/traction/saphyr'
import pacbioModule from '@/store/traction/pacbio'
import ontModule from '@/store/traction/ont'
import state from './state'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const traction = {
  namespaced: true,
  modules: {
    saphyr: saphyrModule,
    pacbio: pacbioModule,
    ont: ontModule
  },
  state,
  getters,
  mutations,
  actions
}

export default traction
