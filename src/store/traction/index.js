import saphyrModule from '@/store/traction/saphyr/index'
import pacbioModule from '@/store/traction/pacbio/index'

const traction = {
  namespaced: true,
  modules: {
    saphyr: saphyrModule,
    pacbio: pacbioModule
  }
}

export default traction
