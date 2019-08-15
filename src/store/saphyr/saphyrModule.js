import tubeModule from '@/store/saphyr/tubeModule'

const saphyrModule = {
  // namespace everything so this would be 'store/saphyr'
  namespaced: true,
  // import the tube module
  modules: {
    tube: tubeModule
  }
}

export default saphyrModule
