// Getters are like computed properties
export default {
  /**
   * Returns a list of all fetched labware
   * @param {Object} state The Vuex state object
   */
  labwareList: (state) => {
    return state.resources.plates
  },
  /**
   * Returns a list of all fetched tagSet
   * @param {Object} state The Vuex state object
   */
  tagSetList: (state) => {},
  /**
   * Returns the selected tag set
   * @param {Object} state The Vuex state object
   */
  selectedTagSet: (state) => {},
  /**
   * Returns a list of selected plates
   * @param {Object} state The Vuex state object
   */
  selectedPlates: (state) => {
    let selected = state.selected.plates.filter((plate) => plate.selected === true)
    selected = selected.map((plate) => {
      return state.resources.plates.find((p) => p.id === plate.id)
    })
    return selected
  },
  /**
   * Returns a list of selected requests
   * @param {Object} state The Vuex state object
   */
  selectedRequests: (state) => {
    let selected = state.selected.requests.filter((request) => request.selected === true)
    selected = selected.map((request) => {
      return state.resources.requests.find((req) => req.id === request.id)
    })
    return selected
  },
}
