// Getters are like computed properties

/**
 * Merge together two representations of the same object.
 * The parent object will be mapped over, and equivalent items from the
 * child object will be merged in. keyFuntion allwos for cases where there
 * is not a 1:1 mapping between ids.
 * @param {Object} parent the parent object, only resources in here will be present in the output.
 * @param {Object} child resources with a matching id will be merged into the parent
 * @param {fn} keyFunction convert id to the key format in the child
 * @example mergeRepresentations(requests,selectedRequests, id => `_${id}`)
 */
const mergeRepresentations = (parent, child, keyFunction = (id) => id) => {
  return Object.values(parent).map((parentRecord) => {
    return { ...child[keyFunction(parentRecord.id)], ...parentRecord }
  })
}
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
    return mergeRepresentations(selected.requests, resources.requests)
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
    const selectedRequests = state.selected.requests
    if (ids) {
      return ids.map((id) => {
        return { ...requests[id], ...selectedRequests[`_${id}`] }
      })
    } else {
      return mergeRepresentations(requests, selectedRequests, (id) => `_${id}`)
    }
  },
}
