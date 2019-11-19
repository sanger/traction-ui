import saphyrTubesModule from '@/store/traction/saphyr/tubes'
import saphyrRunsModule from '@/store/traction/saphyr/runs'

const saphyr = {
  namespaced: true,
  modules: {
    tubes: saphyrTubesModule,
    runs: saphyrRunsModule
  },
  state: {
    labelTemplateId: process.env.VUE_APP_SAPHYR_LABEL_TEMPLATE_ID
  },
  getters: {
    labelTemplateId: state => state.labelTemplateId
  }
}

export default saphyr
