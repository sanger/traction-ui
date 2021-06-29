// Getters are like computed properties
export default {
  /**
   * Returns a list of all fetched labware
   * @param {Object} state The Vuex state object
   */
  labwareList: (state) => {},
  /**
   * Returns a list of all fetched tagSet
   * @param {Object} state The Vuex state object
   */
  tagSetList: (state) => {
    return Object.values(state.resources.tagSets)
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
  selectedPlates: (state) => {},
  /**
   * Returns a list of selected requests
   * @param {Object} state The Vuex state object
   */
  selectedRequests: (state) => {},
}
