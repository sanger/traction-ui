import { defineStore } from 'pinia'
// import { handleResponse } from '@/api/ResponseHelper.js'
// import { groupIncludedByResource, dataToObjectById, extractAttributes } from '@/api/JsonApi.js'
// import useRootStore from '@/stores'
// import { useOntRootStore } from '@/stores/ontRoot.js'

/**
 * Used for combining objects based on id
 * TODO: Move to helper
 */
const mergeRepresentations = (parent, child, keyFunction = (id) => id) => {
  return Object.values(parent).map((parentRecord) => {
    return { ...child[keyFunction(parentRecord.id)], ...parentRecord }
  })
}

/**
 * Defines a store for managing Ont pool creation.
 *
 * @exports useOntPoolCreateStore
 */
export const useOntPoolCreateStore = defineStore('ontPoolCreate', {
  state: () => ({
    resources: {
      // The main source of request information. Requests are indexed by id.
      // Populated by the requests included in the request for plates.
      requests: {},
      // The main plate store. Represents the authoritative source of plate
      // information. Plates are indexed by id.
      plates: {},
      // The main tube store. Represents the authoritative source of tube
      // information. Plates are indexed by id.
      tubes: {},
      /**
       * The main source of well information. Wells are indexed by id.
       * Populated by the wells included in the request for plates.
       * @example {"id":"1","type":"wells","position":"A1","requests":["1"]}
       */
      wells: {},
    },
    selected: {
      // Object reflecting the id of the selected tag set and a selected
      // attribute.
      // eg { id: '1' }
      tagSet: {},
      // Object representing all selected plates. Selected plates are indexed by
      // id. Each plate is represented by an object with an id and a selected
      // attribute { id: 'plate_id', selected: true }
      plates: {},
      // Object representing all selected tubes. Selected tubes are indexed by
      // id. Each tube is represented by an object with an id and a selected
      // attribute { id: 'tube_id', selected: true }
      tubes: {},
    },
    // Handles the store data for the pooling page
    pooling: {
      // Pool: The current pool being edited or created
      pool: {},
      // Tube: The tube for the current pool
      tube: {},
    },
  }),
  getters: {
    /**
     * Returns the requests
     * @param {Object} state The Vuex state object
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
    libraryItem: (state) => (id) => state.pooling.libraries[id],

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
    selectedTubes: ({ selected, resources }) =>
      mergeRepresentations(selected.tubes, resources.tubes),

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
  },
  actions: {},
})
