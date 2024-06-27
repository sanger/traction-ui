const getters = {
  tagsRequest: (state, getters, rootState) => rootState.api.v1.traction.tags,
  tractionTags: (state) => state.tractionTags,
  messages: (state) => state.messages,
}

export default getters
