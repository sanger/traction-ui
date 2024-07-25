import saphyr from '@/store/traction/saphyr'
import pacbio from '@/store/traction/pacbio'
import ont from '@/store/traction/ont'
import state from './state'
import getters from './getters'
import mutations from './mutations'

const traction = {
  namespaced: true,
  modules: {
    saphyr,
    pacbio,
    ont,
  },
  state,
  getters,
  mutations,
}

export default traction
