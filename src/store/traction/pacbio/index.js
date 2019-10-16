import pacbioTubesModule from '@/store/traction/pacbio/tubes'
import pacbioRunsModule from '@/store/traction/pacbio/runs'

const pacbio = {
  namespaced: true,
  modules: {
    tubes: pacbioTubesModule,
    runs: pacbioRunsModule
  },
  state: {
    labelTemplateId: process.env.VUE_APP_PACBIO_LABEL_TEMPLATE_ID,
  },
  getters: {
    labelTemplateId: state => state.labelTemplateId,
  }
}

export default pacbio
