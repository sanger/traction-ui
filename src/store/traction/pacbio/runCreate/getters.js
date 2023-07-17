const buildRunSuitabilityErrors = ({ pool, libraries }) => [
  ...(pool.run_suitability?.errors || []).map(({ detail }) => `Pool ${detail}`),
  ...libraries.flatMap((library) => {
    const libraryName = `Library ${library.id} (${library.sample_name})`
    return library.run_suitability.errors.map(({ detail }) => `${libraryName} ${detail}`)
  }),
]

export default {
  /**
   * Returns a list of all fetched smrt link versions
   * @param {Object} state The Vuex state object
   */

  smrtLinkVersionList: ({ resources }) => {
    return resources.smrtLinkVersions
  },

  defaultSmrtLinkVersion: ({ resources: { smrtLinkVersions } }) => {
    return Object.values(smrtLinkVersions).find((version) => version.default)
  },
  // The smrtLinkVersion of the current run
  smrtLinkVersion: (state) => state.smrtLinkVersion || {},

  // TODO refactor to reuse the functions
  // poolsRequest and pools copied over from pools/getters.js
  poolRequest: (state, getters, rootState) => rootState.api.traction.pacbio.pools,
  pools: (state) => {
    return Object.values(state.pools).map((pool) => {
      const libraries = (pool.libraries || []).map((libraryId) => {
        const { id, type, request, tag, run_suitability } = state.libraries[libraryId]
        const { sample_name } = state.requests[request]
        const { group_id } = state.tags[tag] || {}
        return { id, type, sample_name, group_id, run_suitability }
      })
      const { barcode } = state.tubes[pool.tube]

      return {
        ...pool,
        libraries,
        barcode,
        run_suitability: {
          ...pool.run_suitability,
          formattedErrors: buildRunSuitabilityErrors({ libraries, pool }),
        },
      }
    })
  },

  poolByBarcode:
    (state, { pools }) =>
    (barcode) => {
      return pools.find((pool) => pool.barcode === barcode)
    },

  runItem: (state) => state.run || {},

  runType: (state) => state.runType || {},

  getWell: (state) => (plateNumber, position) => {
    return state.wells[plateNumber][position]
  },

  getPlate: (state) => (plateNumber) => {
    return state.plates[plateNumber]
  },

  runDefaultWellAttributes: (state) => state.defaultWellAttributes || {},

  instrumentNameList: (state) =>
    Object.values(state.instrumentTypeList).map((instrumentType) => instrumentType.name),

  instrumentType: (state) => state.instrumentType || {},
}
