import saphyrTubesModule from '@/store/traction/saphyr/tubes'
import saphyrRunsModule from '@/store/traction/saphyr/runs'
import saphyrRequestsModule from '@/store/traction/saphyr/requests'

const saphyr = {
  namespaced: true,
  modules: {
    tubes: saphyrTubesModule,
    runs: saphyrRunsModule,
    requests: saphyrRequestsModule
  },
  state: {
    labelTemplateId: process.env.VUE_APP_SAPHYR_LABEL_TEMPLATE_ID
  },
  getters: {
    labelTemplateId: state => state.labelTemplateId
  }
}

export default saphyr
