const getters = {
  poolRequest: (state, getters, rootState) => rootState.api.traction.pacbio.pools,
  pools: (state) => {
    return Object.values(state.pools).map(({ id, type, libraries: libraryIds, tube }) => {
      const libraries = libraryIds.map((libraryId) => {
        const { id, type, request, tag } = state.libraries[libraryId]
        const { sample_name } = state.requests[request]
        const { group_id } = state.tags[tag]
        return { id, type, sample_name, group_id }
      })
      const { barcode } = state.tubes[tube]

      return { id, type, libraries, barcode }
    })
  },
  poolByBarcode: (state, { pools }) => (barcode) => {
    return pools.find((pool) => pool.barcode === barcode)
  },
}

export default getters
