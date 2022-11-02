export default {
  /**
   * @param {Object} state The VueX store
   */
  requests: (state) => Object.values(state.resources.requests),
}
