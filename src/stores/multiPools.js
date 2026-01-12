import { defineStore } from 'pinia'
import { handleResponse } from '@/api/ResponseHelper.js'
import { dataToObjectById } from '@/api/JsonApi.js'
import useRootStore from '@/stores'

export const useMultiPoolStore = defineStore('multiPools', {
  state: () => ({
    resources: {
      multiPools: {},
    },
  }),
  getters: {},
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
        this.resources.multiPools = dataToObjectById({ data, includeRelationships: true })
      }

      return { success, errors, meta }
    },
  },
})
