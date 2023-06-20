import { populateById, populateBy, dataToObjectById, dataToObjectByPosition } from '@/api/JsonApi'
import Vue from 'vue'
import defaultState from './state'

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

  /**
   * Populated via API calls from the actions
   * @param {Object} state The VueXState object
   * @param {Object} run The current run to populate the store
   */
  populateRun: (state, { id, attributes, plates }) => {
    state.run = {
      id,
      ...attributes,
      plates,
    }
  },

  /**
   * Populated via API calls from the actions
   * @param {Object} state The VueXState object
   */
  // populateWells: populateBy('wells', dataToObjectById, {
  //   includeRelationships: true,
  //   populateResources: false,
  // }),

  /**
   * Populated the run type
   * @param {Object} state The VueXState object
   * @param {Object} runType The runType
   */
  populateRunType: (state, runType) => {
    state.runType = runType
  },

  /**
   * Populated the run smrtLinkVersion
   * @param {Object} state The VueXState object
   * @param {Object} smrtLinkVersion The smrtLinkVersion
   */
  populateSmrtLinkVersion: (state, smrtLinkVersion) => {
    state.smrtLinkVersion = smrtLinkVersion
  },

  /**
   * Populated via API calls from the actions
   * @param {Object} state The VueXState object
   */
  populatePools: populateById('pools', { includeRelationships: true, populateResources: false }),

  /**
   * @param {Object} state The VueXState object
   * @param {Object} defaultWellAttributes The default well attributes
   */
  populateDefaultWellAttributes: (state, defaultWellAttributes) => {
    state.defaultWellAttributes = defaultWellAttributes
  },

  setPools(state, pools) {
    Vue.set(state, 'pools', {
      ...state.pools,
      ...dataToObjectById({ data: pools, includeRelationships: true }),
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
  clearRunData(state) {
    const new_state = defaultState()
    Object.assign(state, new_state, { resources: state.resources })
  },

  /**
   * @param {Object} { state } The VueXState object
   * @param {Object} well The well to update
   * Replaces the well in store with the updated well
   */
  updateWell: (state, { well, plateIndex }) => {
    const position = well.position
    Vue.set(
      state.run.plates[plateIndex].wells,
      position,
      Object.assign({}, state.run.plates[plateIndex].wells[position], well),
    )
  },

  /**
   * @param {Object} { state } The VueXState object
   * @param {Object} well The well to delete
   * @param {Object} plateIndex The number of the plate
   * Adds _destroy key to the well in store so future wells
   * for the same position can be added
   */
  deleteWell: (state, { well, plateIndex }) => {
    const position = well.position

    Vue.delete(state.run.plates[plateIndex].wells, position)
    const newKey = position + '_destroy'

    Vue.set(
      state.run.plates[plateIndex].wells,
      newKey,
      Object.assign({}, state.run.plates[plateIndex].wells[newKey], well),
    )
  },
}
