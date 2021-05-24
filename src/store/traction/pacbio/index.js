import pacbioTubesModule from '@/store/traction/pacbio/tubes'
import pacbioRunsModule from '@/store/traction/pacbio/runs'
import pacbioRequestsModule from '@/store/traction/pacbio/requests'
import pacbioLibrariesModule from '@/store/traction/pacbio/libraries'
import pacbioPlatesModule from '@/store/traction/pacbio/plates'

const pacbio = {
  namespaced: true,
  modules: {
    tubes: pacbioTubesModule,
    runs: pacbioRunsModule,
    requests: pacbioRequestsModule,
    libraries: pacbioLibrariesModule,
    plates: pacbioPlatesModule,
  },
  state: {
    labelTemplateId: process.env.VUE_APP_PACBIO_LABEL_TEMPLATE_ID,
  },
  getters: {
    labelTemplateId: (state) => state.labelTemplateId,
  },
}

export default pacbio
