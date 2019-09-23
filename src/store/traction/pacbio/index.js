import pacbioTubesModule from '@/store/traction/pacbio/tubes/index'

const pacbio = {
  namespaced: true,
  modules: {
    tubes: pacbioTubesModule
  }
}

export default pacbio
