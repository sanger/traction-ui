import { defineStore } from 'pinia'
import { handleResponse } from '@/api/ResponseHelper.js'
import {
  dataToObjectById,
  extractAttributes,
  extractRelationshipsAndGroupById,
  groupIncludedByResource,
} from '@/api/JsonApi.js'
import useRootStore from '@/stores'
import { createSubPools } from '@/stores/utilities/multiPool.js'

export const useMultiPoolStore = defineStore('multiPools', {
  state: () => ({
    resources: {
      multiPools: {},
    },
  }),
  getters: {
    /**
     * Returns the multi pool items as an array
     * @param {Object} state The state object
     * @return {Array} The array of multi pool items
     */
    multiPoolItems(state) {
      return Object.values(state.resources.multiPools)
    },
  },
  actions: {
    /**
     * Fetches multiple pools from the API with optional filtering and pagination.
     *
     * @param {Object} filter - Optional filter criteria for the request.
     * @param {Object} page - Optional pagination parameters.
     * @returns {Object} - An object containing the success status, errors, and meta information.
     */
    async fetchMultiPools(filter = {}, page = {}) {
      const rootStore = useRootStore()

      const request = rootStore.api.traction.multi_pools
      const promise = request.get({ page, filter })
      const response = await handleResponse(promise)

      const { success, body: { data, meta = {} } = {}, errors = [] } = response

      if (success) {
        this.resources.multiPools = dataToObjectById({ data, includeRelationships: false })
      }

      return { success, errors, meta }
    },
    /**
     * Fetches sub-pools for a given multi-pool and updates the store with the result.
     *
     * Makes an API request to retrieve a multi-pool and its related sub-pools (multi_pool_positions and pools).
     * Extracts attributes and relationships, groups included resources, and constructs sub-pool objects.
     * Updates the store's multiPools resource with the fetched multi-pool and its subPools.
     *
     * @param {String} id - The ID of the multi-pool to fetch sub-pools for.
     * @returns {Object} An object containing:
     *   - success {Boolean}: Whether the request was successful.
     *   - errors {Array}: Any errors returned from the API.
     */
    async fetchSubPools(id) {
      const rootStore = useRootStore()

      const request = rootStore.api.traction.multi_pools
      const promise = request.find(id, { include: 'multi_pool_positions.pacbio_pool' })
      const response = await handleResponse(promise)

      const { success, body: { data, included } = {}, errors = [] } = response

      if (success) {
        const multiPool = extractAttributes(data)
        const relationships = extractRelationshipsAndGroupById(data.relationships)
        const { multi_pool_positions, pools } = groupIncludedByResource(included)
        const subPools = createSubPools({
          multiPool: { ...multiPool, ...relationships },
          multiPoolPositions: dataToObjectById({
            data: multi_pool_positions,
            includeRelationships: true,
          }),
          pools: dataToObjectById({ data: pools }),
        })

        this.resources.multiPools[id] = {
          ...multiPool,
          ...relationships,
          subPools,
        }
      }

      return { success, errors }
    },
  },
})
