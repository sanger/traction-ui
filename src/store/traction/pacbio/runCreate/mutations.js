import { populateById } from '@/api/JsonApi'
import { dataToObjectById } from '@/api/JsonApi'

// Mutations handle synchronous update of state.
const mutations = {
  // These mutations are duplicated across other stores,
  // access the existing ones from actions OR
  // create new mutation encapsulating all these OR
  // leave as it is duplicating code
  populateRequests: populateById('requests', { includeRelationships: true }),
  populateTubes: populateById('tubes', { includeRelationships: true }),
  populateTags: populateById('tags'),
  populateLibraries: populateById('libraries', { includeRelationships: true }),
  setPools(state, pools) {
    state.pools = dataToObjectById({ data: pools, includeRelationships: true })
  },
}

export default {
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} smrtLinkVersions The SmrtLinkVersions to populate the store
   */
  populateSmrtLinkVersions: populateById('smrtLinkVersions'),
  mutations,
}
