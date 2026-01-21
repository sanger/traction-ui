import { defineStore } from 'pinia'
import { handleResponse } from '@/api/ResponseHelper.js'
import useRootStore from '@/stores'
import {
  dataToObjectByPosition,
  extractAttributes,
  groupIncludedByResource,
} from '@/api/JsonApi.js'
import { payload } from '@/stores/utilities/multiPool.js'

export const useMultiPoolCreateStore = defineStore('multiPoolCreate', {
  state: () => ({
    multiPool: {
      pipeline: 'pacbio',
      pool_method: 'Plate',
    },
    multiPoolPositions: {},
  }),
  getters: {
    multiPoolPositionItems: (state) => {
      return Object.values(state.multiPoolPositions)
    },
  },
  actions: {
    /**
     * Fetches a multi pool by its id and populates the store state with the retrieved data.
     *
     * @param {*} multiPoolId the id of the multi pool to fetch
     * @returns
     */
    async fetchMultiPool(multiPoolId) {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.multi_pools
      const promise = request.find({
        id: multiPoolId,
        include: 'multi_pool_positions',
      })
      const response = await handleResponse(promise)
      const { success, body: { data, included = [] } = {}, errors = [] } = response

      if (success) {
        const { multi_pool_positions = [] } = groupIncludedByResource(included)

        //Populate multi pool attributes
        this.multiPool = extractAttributes(data)

        //Populate multi pool positions
        this.multiPoolPositions = dataToObjectByPosition({
          data: multi_pool_positions,
          includeRelationships: true,
        })
      }

      return { success, errors }
    },

    /**
     * Asynchronously creates a multi pool with the given pool positions and pools.
     *
     * @async
     * @returns {Promise<Object>} A promise that resolves to an object containing the success status, barcode, and any errors.
     *
     * @example
     * // Create a multi pool
     * const result = await createMultiPool();
     * console.log(result); // { success: true, barcode: 'barcode123', errors: [] }
     */
    async createMultiPool() {
      const { multiPool } = this
      const rootStore = useRootStore()
      const request = rootStore.api.traction.multi_pools
      const promise = request.create({
        data: payload({ multiPool }),
      })
      const { success, body: { data = {} } = {}, errors } = await handleResponse(promise)
      const { attributes: { barcode = '' } = {} } = data
      return { success, barcode, errors }
    },

    /**
     * Sets the current multi pool. If it is a new multi pool it will be created.
     * If it is an existing multi pool it will be updated.
     * @param id The id of the multi pool. It will be new or existing
     * @returns { Object } { success, errors }.
     */
    async setMultiPool({ id }) {
      // If the multi pool data is already loaded, return success
      if (this.isValidPersisted()) {
        return { success: true }
      }

      // Initialize multiPool state defaults
      this.multiPool = {
        pipeline: 'Pacbio',
        pooling_layout: 'Plate',
      }

      // If the id is not a number, it is a new multi pool
      if (isNaN(id)) {
        // if it is a new multi pool, return success
        return { success: true }
      }

      // if it is an existing multi pool, call the fetch multi pool action
      let { success, errors = [] } = await this.fetchMultiPool(id)
      // return the result from the fetchMultiPool
      return { success, errors }
    },

    /**
     * Get a pool by its position.
     * @param {String} position - The position of the pool.
     * @returns {Object} - The pool at the given position.
     */
    getPool(position) {
      return this.multiPoolPositions[position] || {}
    },

    // Reset the store data
    clearData() {
      this.$reset()
    },

    // Check if multi pool data is already loaded
    isValidPersisted() {
      // Check the store exists in storage
      const persisted = localStorage.getItem('multiPoolCreate') !== null

      if (persisted) return true

      // For existing multi pools we will need some logic to check the ids match
      // And the reset logic should restore the pool to its initial state, not clear all data
    },
  },
  persist: true,
})
