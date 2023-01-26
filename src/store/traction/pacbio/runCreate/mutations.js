import { populateById } from '@/api/JsonApi'
import { dataToObjectById } from '@/api/JsonApi'

// Mutations handle synchronous update of state

const mutations = {
  setPools(state, pools) {
    state.pools = dataToObjectById({ data: pools, includeRelationships: true })
  },
  setTubes(state, tubes) {
    state.tubes = dataToObjectById({ data: tubes, includeRelationships: false })
  },
  setLibraries(state, libraries) {
    state.libraries = dataToObjectById({ data: libraries, includeRelationships: true })
  },
  setTags(state, tags) {
    state.tags = dataToObjectById({ data: tags, includeRelationships: false })
  },
  setRequests(state, requests) {
    state.requests = dataToObjectById({ data: requests, includeRelationships: false })
  },
}

export default {
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} smrtLinkVersions The SmrtLinkVersions to populate the store
   */
  populateSmrtLinkVersions: populateById('smrtLinkVersions'),
  ...mutations,
}
