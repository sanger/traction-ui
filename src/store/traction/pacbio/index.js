import pacbioRequestsModule from '@/store/traction/pacbio/requests'
import pacbioPoolsModule from '@/store/traction/pacbio/pools'
import pacbioPlatesModule from '@/store/traction/pacbio/plates'
import poolCreate from '@/store/traction/pacbio/poolCreate'

const pacbio = {
  namespaced: true,
  modules: {
    requests: pacbioRequestsModule,
    pools: pacbioPoolsModule,
    plates: pacbioPlatesModule,
    poolCreate: poolCreate,
  },
  state: {
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
}

export default pacbio
