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
  tagList: (state) => ids => {
    const tags = state.resources.tags
    if (ids) {
      return ids.map(id => tags[id])
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
   * @param {Object} state The Vuex state object
   */
  selectedRequests: (state) => {},
  /**
   * Returns a list of wells for the plate given
   * @param {Object} state The Vuex state object
   */
  plateWells: (state) => id => {
    let well_ids = state.resources.plates[id].wells
    return well_ids.map(id => state.resources.wells[id])
  },
  /**
   * Returns the relate request for the well given
   * @param {Object} state The Vuex state object
   */
  wellRequest: (state) => id => {
    let request_id = state.resources.wells[id].requests
    if (request_id) {
      return state.resources.requests[request_id[0]]
    } else {
      return
    }
  },
}
