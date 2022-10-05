export default {
  /**
   * Returns a list of all fetched smrt link versions
   * @param {Object} state The Vuex state object
   */
  smrtLinkVersionList: ({ resources }) => {
    return resources.smrtLinkVersions
  },
}