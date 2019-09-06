import saphyrTubesModule from '@/store/traction/saphyr/tubes/index'

const saphyr = {
  namespaced: true,
  modules: {
    tubes: saphyrTubesModule
  }
}

export default saphyr
