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

const prefixWithUnderscore = (id) => `_${id}`

export default {
  /**
   * Returns a list of all fetched labware
   * @param {Object} state The Vuex state object
   */
  labwareList: ({ selected, resources }) => {
    return mergeRepresentations(resources.plates, selected.plates, prefixWithUnderscore)
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
  selectedTagSet: ({ resources, selected }) => {
    if (selected.tagSet.id) {
      const tagSet = resources.tagSets[selected.tagSet.id]
      const tags = tagSet.tags.map((tag) => resources.tags[tag])
      return { ...tagSet, tags }
    } else {
      return { id: null, tags: [] }
    }
  },

  /**
   * Returns a list of selected plates
   * @param {Object} state The Vuex state object
   */
  selectedPlates: ({ selected, resources }) => {
    return mergeRepresentations(selected.plates, resources.plates)
  },

  /**
   * Returns a list of selected requests
   *
   * Note: Ordering depends on selectRequest prefixing ids with underscore, as javascript objects
   * sort most keys in insertion order, but numeric keys in numeric order.
   * @param {Object} state The Vuex state object
   * @return {Array} An array of selected requests in the order in which they were selected
   */
  selectedRequests: ({ libraries, resources }) => {
    return Object.values(libraries).map(({ pacbio_request_id }) => {
      return { ...resources.requests[pacbio_request_id], selected: true }
    })
  },

  /**
   * Returns a list of all fetched wells
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
   * Returns a list of all fetched requests
   * @param {Object} state The Vuex state object
   */
  requestList: (state) => (ids) => {
    const requests = state.resources.requests
    const selectedRequests = state.libraries
    if (ids) {
      return ids.map((id) => {
        return { ...requests[id], selected: !!selectedRequests[`_${id}`] }
      })
    } else {
      return Object.values(requests).map((request) => {
        return { ...request, selected: !!selectedRequests[`_${request.id}`] }
      })
    }
  },
  /**
   * Returns a library
   * @param {Object} state The Vuex state object
   */
  libraryItem: ({ libraries }) => (id) => {
    return libraries[`_${id}`]
  },

  /**
   * Returns the pool
   * @param {Object} state The Vuex state object
   */
  poolItem: (state) => {
    return state.pool || {}
  },

  /**
   * Returns the tube
   * @param {Object} state The Vuex state object
   */
  tubeItem: (state) => {
    return state.tube || {}
  },
}
