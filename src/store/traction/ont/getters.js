import { wellToIndex } from './wellHelpers'

const mergeRepresentations = (parent, child, keyFunction = (id) => id) => {
  return Object.values(parent).map((parentRecord) => {
    return { ...child[keyFunction(parentRecord.id)], ...parentRecord }
  })
}

const sortRequestByWellColumnIndex = (resources) => (a, b) =>
  wellToIndex(resources.wells[a.well] || { position: 'A1' }) -
  wellToIndex(resources.wells[b.well] || { position: 'A1' })

export default {
  /**
   * @param {Object} state The VueX store
   */
  requests: (state) => Object.values(state.resources.requests),

  /**
   * Returns the pool
   * @param {Object} state The Vuex state object
   */
  poolItem: (state) => state.pooling.pool || {},

  /**
   * Returns the tube
   * @param {Object} state The Vuex state object
   */
  tubeItem: (state) => state.pooling.tube || {},

  /**
   * Returns a library
   * @param {Object} state The Vuex state object
   */
  libraryItem:
    (state) =>
    (id) =>
      state.pooling.libraries[`_${id}`],

  /**
   * Returns a list of selected plates
   * @param {Object} state The Vuex state object
   */
  selectedPlates: ({ selected, resources }) =>
    mergeRepresentations(selected.plates, resources.plates),
  
  /**
   * Returns a list of selected tubes
   * @param {Object} state The Vuex state object
   */
  selectedTubes: ({ selected, resources }) => mergeRepresentations(selected.tubes, resources.tubes),

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
    const selectedRequests = state.pooling.libraries
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
   * Returns a list of selected requests
   *
   * Note: Ordering is grouped by plate (in id order) and sorted in column order
   * @param {Object} state The Vuex state object
   * @return {Array} An array of selected requests in the order in which they were selected
   */
  selectedRequests: ({ pooling, resources }) => {
    return Object.values(pooling.libraries)
      .map(({ ont_request_id }) => ({
        ...resources.requests[ont_request_id],
        selected: true,
      }))
      .sort(sortRequestByWellColumnIndex(resources))
  },
}
