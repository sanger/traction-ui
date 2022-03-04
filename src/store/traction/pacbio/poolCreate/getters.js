// Getters are like computed properties
import { wellToIndex } from './wellHelpers'

/**
 * Merge together two representations of the same object.
 * The parent object will be mapped over, and equivalent items from the
 * child object will be merged in. keyFunction allows for cases where there
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

const sortRequestByWellColumnIndex = (resources) => (a, b) =>
  wellToIndex(resources.wells[a.well] || { position: 'A1' }) -
  wellToIndex(resources.wells[b.well] || { position: 'A1' })

/**
 * Sort the requests based on their labware. Tubes will be sorted after plates,
 * and then each labware is sorted in id order
 */
const sortRequestByLabware = (resources) => (a, b) => {
  if (a.tube && b.tube) {
    // Both our tubes
    return parseInt(a.tube) - parseInt(b.tube)
  } else if (a.well && b.well) {
    // Both are plates
    return parseInt(resources.wells[a.well].plate) - parseInt(resources.wells[b.well].plate)
  } else {
    // A plate and a tube
    return parseInt(a.tube || 0) - parseInt(b.tube || 0)
  }
}

export default {
  /**
   * Returns a list of all fetched plates
   * @param {Object} state The Vuex state object
   */
  plateList: ({ selected, resources }) => {
    return mergeRepresentations(resources.plates, selected.plates)
  },
  /**
   * Returns a list of all fetched tubes
   * @param {Object} state The Vuex state object
   */
  tubeList: ({ selected, resources }) => {
    return mergeRepresentations(resources.tubes, selected.tubes)
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
  selectedPlates: ({ selected, resources }) =>
    mergeRepresentations(selected.plates, resources.plates),

  /**
   * Returns a list of selected tubes
   * @param {Object} state The Vuex state object
   */
  selectedTubes: ({ selected, resources }) => mergeRepresentations(selected.tubes, resources.tubes),

  /**
   * Returns a list of selected requests
   *
   * Note: Ordering is grouped by plate (in id order) and sorted in column order
   * @param {Object} state The Vuex state object
   * @return {Array} An array of selected requests in the order in which they were selected
   */
  selectedRequests: ({ libraries, resources }) => {
    return Object.values(libraries)
      .map(({ pacbio_request_id }) => ({
        ...resources.requests[pacbio_request_id],
        selected: true,
      }))
      .sort(sortRequestByWellColumnIndex(resources))
      .sort(sortRequestByLabware(resources))
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
  libraryItem:
    ({ libraries }) =>
    (id) =>
      libraries[`_${id}`],

  /**
   * Returns the pool
   * @param {Object} state The Vuex state object
   */
  poolItem: (state) => state.pool || {},

  /**
   * Returns the tube
   * @param {Object} state The Vuex state object
   */
  tubeItem: (state) => state.tube || {},
}
