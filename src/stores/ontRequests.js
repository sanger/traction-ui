import { defineStore } from 'pinia'
import { handleResponse } from '@/api/ResponseHelper.js'
import { dataToObjectById } from '@/api/JsonApi.js'
import useRootStore from '@/stores'

export const useOntRequestsStore = defineStore('ontRequests', {
  state: () => ({
    resources: {
      requests: {},
    },
  }),

  getters: {
    /**
     * Returns the requests
     * @param {Object} state The state object
     */
    requests: (state) => Object.values(state.resources.requests),
  },
  actions: {
    /**
     * Fetches ONT requests from the API with optional filters and pagination.
     *
     * @param {Object} filter - Optional filters to apply to the request.
     * @param {Object} page - Optional pagination parameters.
     * @returns {Object} - An object containing the success status, errors, and meta information.
     */
    async fetchRequests(filter = {}, page = {}) {
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
     * Updates an existing ONT request.
     *
     * @param {Object} payload - The request payload containing updated data.
     * @returns {Object} An object containing:
     *   - success {boolean}: Whether the API request was successful.
     *   - errors {Object}: Any errors returned from the API.
     */
    async updateRequest(payload) {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.ont.requests
      const promise = request.update(payload)
      const response = await handleResponse(promise)
      const { success, errors = {} } = response

      if (success) {
        this.resources.requests[payload.id] = { ...this.resources.requests[payload.id], ...payload }
      }
      return { success, errors }
    },
  },
})
