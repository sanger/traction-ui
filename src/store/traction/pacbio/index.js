import pacbioTubesModule from '@/store/traction/pacbio/tubes'
import pacbioRunsModule from '@/store/traction/pacbio/runs'
import pacbioRequestsModule from '@/store/traction/pacbio/requests'
import pacbioLibrariesModule from '@/store/traction/pacbio/libraries'
import pacbioPoolsModule from '@/store/traction/pacbio/pools'
import pacbioPlatesModule from '@/store/traction/pacbio/plates'
import poolCreate from '@/store/traction/pacbio/poolCreate'

const pacbio = {
  namespaced: true,
  modules: {
    tubes: pacbioTubesModule,
    runs: pacbioRunsModule,
    requests: pacbioRequestsModule,
    libraries: pacbioLibrariesModule,
    pools: pacbioPoolsModule,
    plates: pacbioPlatesModule,
    poolCreate: poolCreate,
  },
  state: {
    labelTemplateId: import.meta.env.VITE_PACBIO_LABEL_TEMPLATE_ID,
    // We may decide to pull this from traction-service
    libraryTypes: [
      'Pacbio_HiFi',
      'Pacbio_HiFi_mplx',
      'Pacbio_Microbial_mplx',
      'Pacbio_IsoSeq',
      'PacBio_IsoSeq_mplx',
      'PacBio_Ultra_Low_Input',
      'PacBio_Ultra_Low_Input_mplx',
    ],
  },
  getters: {
    labelTemplateId: (state) => state.labelTemplateId,
  },
}

export default pacbio
