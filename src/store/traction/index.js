import saphyrModule from '@/store/traction/saphyr'
import pacbioModule from '@/store/traction/pacbio'

const traction = {
  namespaced: true,
  modules: {
    saphyr: saphyrModule,
    pacbio: pacbioModule
  }
}

export default traction
