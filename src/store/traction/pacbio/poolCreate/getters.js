// Getters are like computed properties
export default {
  /**
   * Returns a list of all fetched labware
   * @param {Object} state The Vuex state object
   */
  labwareList: (state) => {
    return Object.values(state.resources.plates)
  },
  /**
   * Returns a list of all fetched tagSet
   * @param {Object} state The Vuex state object
   */
  tagSetList: (state) => {
    return Object.values(state.resources.tagSets)
  },
  /**
   * Returns a list of all fetched tagSet
   * @param {Object} state The Vuex state object
   */
  tagList: (state) => (ids) => {
    const tags = state.resources.tags
    if (ids) {
      return ids.map((id) => tags[id])
    } else {
      return tags.values
    }
  },
  /**
   * Returns the selected tag set
   * @param {Object} state The Vuex state object
   */
  selectedTagSet: (state) => {
    return state.selected.tagSet
  },

  /**
   * Returns a list of selected plates
   * @param {Object} state The Vuex state object
   */
  selectedPlates: (state) => {
    return Object.values(state.selected.plates)
  },

  /**
   * Returns a list of selected requests
   *
   * Note: Ordering depends on selectRequest prefixing ids with underscore, as javascript objects
   * sort most keys in insertion order, but numeric keys in numeric order.
   * @param {Object} state The Vuex state object
   * @return {Array} An array of selected requests in the order in which they were selected
   */
  selectedRequests: ({ selected, resources }) => {
    const requests = resources.requests
    return Object.values(selected.requests).map((selectedRequest) => {
      return { ...requests[selectedRequest.id], ...selectedRequest }
    })
  },

  /**
   * Returns a list of all fetched tagSet
   * @param {Object} state The Vuex state object
   */
  wellList: (state) => (ids) => {
    const wells = state.resources.wells
    if (ids) {
      return ids.map((id) => wells[id])
    } else {
      return wells.values
    }
  },
  /**
   * Returns a list of all fetched tagSet
   * @param {Object} state The Vuex state object
   */
  requestList: (state) => (ids) => {
    const requests = state.resources.requests
    if (ids) {
      return ids.map((id) => requests[id])
    } else {
      return requests.values
    }
  },
}
