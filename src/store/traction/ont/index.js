import ontRunsModule from '@/store/traction/ont/runs'

const ont = {
  namespaced: true,
  modules: {
    runs: ontRunsModule,
  },
  state: {
    // We may decide to pull this from traction-service
    instrumentTypes: [
      'minion', // 1 flowcell
      'gridion', // 5 flowcells
      'promethion', // 24 flowcells
    ],
  },
}

export default ont
