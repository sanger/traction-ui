import saphyrModule from '@/store/traction/saphyr/index'

const traction = {
  namespaced: true,
  modules: {
    saphyr: saphyrModule
  }
}

export default traction
