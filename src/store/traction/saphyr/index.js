import saphyrTubesModule from '@/store/traction/saphyr/tubes/index'

const saphyr = {
  namespaced: true,
  modules: {
    tubes: saphyrTubesModule
  },
  state: {
    labelTemplateId: process.env.VUE_APP_SAPHYR_LABEL_TEMPLATE_ID,
  },
  getters: {
    labelTemplateId: state => state.labelTemplateId,
  }
}

export default saphyr
