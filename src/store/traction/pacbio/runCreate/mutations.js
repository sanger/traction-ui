import { populateById } from '@/api/JsonApi'
import { dataToObjectById } from '@/api/JsonApi'
import Vue from 'vue'

// Mutations handle synchronous update of state

// Helper function for setting pools data
const setData = (state, type, data, includeRelationships = false) => {
  Vue.set(state, type, {
    ...state[type],
    ...dataToObjectById({ data, includeRelationships }),
  })
}

export default {
  /**
   * Populated with resources via APi calls from the actions
   * @param {Object} state The VueXState object
   * @param {Array.{}} smrtLinkVersions The SmrtLinkVersions to populate the store
   */
  populateSmrtLinkVersions: populateById('smrtLinkVersions'),
  // ...mutations,
  setPools(state, pools) {
    Vue.set(state, 'pools', {
      ...state.pools,
      ...dataToObjectById({ data: pools, includeRelationships: true }),
    })
  },
  setPoolsForExistingRun(state, pools) {
    const poolsObject = pools.reduce(function (acc, cur) {
      acc[cur.id] = cur
      return acc
    }, {})
    Vue.set(state, 'pools', {
      ...state.pools,
      ...poolsObject,
    })
  },

  setTubes(state, tubes) {
    setData(state, 'tubes', tubes, false)
  },
  setLibraries(state, libraries) {
    setData(state, 'libraries', libraries, true)
  },
  setTags(state, tags) {
    setData(state, 'tags', tags, false)
  },
  setRequests(state, requests) {
    setData(state, 'requests', requests, false)
  },

  removePool(state, id) {
    Vue.delete(state.pools, id)
  },
}
