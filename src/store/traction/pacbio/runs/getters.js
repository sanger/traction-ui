const getters = {
  runs: (state) => Object.values(state.runs),
  run: (state) => (id) => {
    return state.runs[id]
  },
  runRequest: (state, getters, rootState) => rootState.api.traction.pacbio.runs,
  currentRun: (state) => state.currentRun,
  pacbioRequests: (state, getters, rootState) => rootState.api.traction.pacbio,
  well: (state) => (position) => {
    return state.currentRun.plate.wells.find((well) => well.position === position)
  },

  /**
   * Returns a list of all fetched smrt link versions
   * @param {Object} state The Vuex state object
   */
  smrtLinkVersionList: ({ resources }) => {
    return resources.smrtLinkVersions
  },
  defaultSmrtLinkVersion: ({ resources }) => {
    return Object.values(resources.smrtLinkVersions).find((version) => version.default)
  },
}

export default getters
