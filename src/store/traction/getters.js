const getters = {
  tagsRequest: (state, getters, rootState) => rootState.api.traction.tags,
  tractionTags: (state) => state.tractionTags,
}

export default getters
