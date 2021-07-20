const getters = {
  pools: (state) => {
    return Object.values(state.pools).map((pool) => {
      const libraries = pool.libraries.map((libraryId) => {
        const { id, type, requests, tags } = state.libraries[libraryId]
        const { sample_name } = state.requests[requests[0]]
        const { group_id } = state.tags[tags[0]]
        return { id, type, sample_name, group_id }
      })
      const { barcode } = state.tubes[pool.tubes[0]]

      return { ...pool, libraries, barcode, tubes: undefined }
    })
  },
  poolByBarcode: (state, { pools }) => (barcode) => {
    return pools.find((pool) => pool.barcode === barcode)
  },
}

export default getters
