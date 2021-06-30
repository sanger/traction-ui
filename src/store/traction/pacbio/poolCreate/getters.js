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
  selectedRequests: (state) => {},
}
