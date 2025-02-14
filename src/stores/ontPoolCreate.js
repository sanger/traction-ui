import { defineStore } from 'pinia'
import { wellToIndex } from './utilities/wellHelpers.js'
import { handleResponse } from '@/api/ResponseHelper.js'
import useRootStore from '@/stores/index.js'
import { dataToObjectById, groupIncludedByResource } from '@/api/JsonApi.js'

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
 * Orders the well resources by column/row index
 * @param resources The Vuex state resources object
 */
const sortRequestByWellColumnIndex = (resources) => (a, b) =>
  wellToIndex(resources.wells[a.well] || { position: 'A1' }) -
  wellToIndex(resources.wells[b.well] || { position: 'A1' })

/**
 * Defines a store for managing Ont pool creation.
 *
 * @exports useOntPoolCreateStore
 */
export const useOntPoolCreateStore = defineStore('ontPoolCreate', {
  state: () => ({
    resources: {
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
      // The main source of request information. Requests are indexed by id.
      // Populated by the requests included in the request for plates.
      requests: {},
      // The main source of tagSet information. tagSets are indexed by id.
      tagSets: {},
      // The main source of tagSet information. tagSets are indexed by id.
      // Populated by the tags from a tag set
      tags: {},
      // The main source of pool information. Pools are indexed by id.
      pools: {},
      // The main source of library information. libraries are indexed by id.
      libraries: {},
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
      // Libraries. Indexed by an internally generated id.
      libraries: {},
      // Pool: The current pool being edited or created
      pool: {},
      // Tube: The tube for the current pool
      tube: {},
    },
  }),
  getters: {
    /**
     * Returns the requests
     * @param {Object} state The state object
     */
    requests: (state) => Object.values(state.resources.requests),

    /**
     * Returns the pool
     * @param {Object} state The state object
     */
    poolItem: (state) => state.pooling.pool || {},

    /**
     * Returns the tube
     * @param {Object} state The state object
     */
    tubeItem: (state) => state.pooling.tube || {},

    /**
     * Returns a library
     * @param {Object} state The state object
     */
    libraryItem: (state) => (id) => state.pooling.libraries[id],

    /**
     * Returns a list of selected plates
     * @param {Object} state The state object
     */
    selectedPlates: ({ selected, resources }) =>
      mergeRepresentations(selected.plates, resources.plates),

    /**
     * Returns a list of selected tubes
     * @param {Object} state The state object
     */
    selectedTubes: ({ selected, resources }) =>
      mergeRepresentations(selected.tubes, resources.tubes),

    /**
     * Returns a list of all fetched wells
     * @param {Object} state The state object
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
          return { ...requests[id], selected: !!selectedRequests[id] }
        })
      } else {
        return Object.values(requests).map((request) => {
          return { ...request, selected: !!selectedRequests[request.id] }
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

    /**
     * Returns a list of pools
     *
     * @param {Object} state The Vuex state object
     * @return {Array} An array of selected requests in the order in which they were selected
     */
    pools: (state) => {
      // We catch here in case this getter is called when the resources aren't pulled
      try {
        return Object.values(state.resources.pools).map((pool) => {
          const libraries = pool.libraries.map((libraryId) => {
            const { id, type, request, tag } = state.resources.libraries[libraryId]
            const { sample_name } = state.resources.requests[request]
            const { group_id } = state.resources.tags[tag] || {}
            return { id, type, sample_name, group_id }
          })

          const { barcode } = state.resources.tubes[pool.tube]
          return {
            ...pool,
            libraries,
            barcode,
          }
        })
      } catch {
        return []
      }
    },
  },
  actions: {
    /**
     * Fetches ONT requests from the API with optional filters and pagination.
     *
     * @param {Object} filter - Optional filters to apply to the request.
     * @param {Object} page - Optional pagination parameters.
     * @returns {Object} - An object containing the success status, errors, and meta information.
     */
    async fetchOntRequests(filter = {}, page = {}) {
      const rootStore = useRootStore()

      const request = rootStore.api.traction.ont.requests
      const promise = request.get({ page, filter })
      const response = await handleResponse(promise)

      const { success, body: { data, meta = {} } = {}, errors = [] } = response

      if (success) {
        this.resources.requests = dataToObjectById({ data, includeRelationships: true })
      }

      return { success, errors, meta }
    },

    /**
     * Fetches ONT pools from the API with optional filters and pagination.
     *
     * @param {Object} filter - Optional filters to apply to the request.
     * @param {Object} page - Optional pagination parameters.
     * @returns {Object} - An object containing the success status, errors, and meta information.
     */
    async fetchOntPools(filter = {}, page = {}) {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.ont.pools
      const promise = request.get({
        page,
        filter,
        include: 'tube,libraries.tag,libraries.request',
      })
      const response = await handleResponse(promise)

      const { success, body: { data, included = [], meta = {} } = {}, errors = [] } = response
      const { tubes, libraries, tags, requests } = groupIncludedByResource(included)

      if (success) {
        this.resources.requests = dataToObjectById({ data: requests, includeRelationships: true })
        this.resources.tubes = dataToObjectById({ data: tubes, includeRelationships: true })
        this.resources.libraries = dataToObjectById({ data: libraries, includeRelationships: true })
        this.resources.tags = dataToObjectById({ data: tags, includeRelationships: true })
        this.resources.pools = dataToObjectById({ data, includeRelationships: true })
      }

      return { success, errors, meta }
    },
  },
})
