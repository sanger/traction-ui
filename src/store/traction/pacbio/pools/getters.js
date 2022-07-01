const buildRunSuitabilityErrors = ({ pool, libraries }) => [
  ...pool.run_suitability.errors.map(({ detail }) => `Pool ${detail}`),
  ...libraries.flatMap((library) => {
    const libraryName = `Library ${library.id} (${library.sample_name})`
    return library.run_suitability.errors.map(({ detail }) => `${libraryName} ${detail}`)
  }),
]

const getters = {
  poolRequest: (state, getters, rootState) => rootState.api.traction.pacbio.pools,
  pools: (state) => {
    return Object.values(state.pools).map((pool) => {
      const libraries = pool.libraries.map((libraryId) => {
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
}

export default getters
