import saphyrModule from '@/store/traction/saphyr'
import pacbioModule from '@/store/traction/pacbio'
import actions from './actions'

const traction = {
  namespaced: true,
  modules: {
    saphyr: saphyrModule,
    pacbio: pacbioModule
  },
  actions
}

export default traction
