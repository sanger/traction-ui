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
   * @param {Object} state The Vuex state object
   */

  // TODO: add getter
  // eslint-disable-next-line no-unused-vars
  selectedRequests: (state) => {},
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
  /**
   * Returns a list of wells for the plate given
   * @param {Object} state The Vuex state object
   */
  // TODO: we should just return the ids by their wells.
  // no need to pass plate
  plateWells: (state) => (id) => {
    let well_ids = state.resources.plates[id].wells
    return well_ids.map((id) => state.resources.wells[id])
  },
  /**
   * Returns the relate request for the well given
   * @param {Object} state The Vuex state object
   */
  // TODO: just return the requests. No need to pass well
  wellRequest: (state) => (id) => {
    let request_id = state.resources.wells[id].requests
    if (request_id) {
      return state.resources.requests[request_id[0]]
    } else {
      return
    }
  },
}
