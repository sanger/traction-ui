import { defineStore } from 'pinia'
import useRootStore from '@/stores'
import { createRequestPayload } from '@/stores/utilities/pacbioRequests.js'
import { handleResponse } from '@/api/ResponseHelper.js'
import { dataToObjectById, extractAttributes } from '@/api/JsonApi.js'

export const usePacbioRequestsStore = defineStore('pacbioRequests', {
  state: () => ({
    /**
     * @property {Object} requests - An object to store all requests indexed by id.
     */
    requests: {},
  }),

  getters: {
    /**
     * Returns request objects as an array.
     * @param {*} state - The state object containing requests.
     * @returns {Array<Object>} - An array of request objects.
     */
    requestsArray: (state) => Object.values(state.requests),
  },

  actions: {
    /**
     * Sets the requests in the store by fetching them from the API.
     *
     * @param {Object} options - The options to pass to the API request.
     * @returns {Promise<Object>} A promise that resolves to an object containing:
     *   - {boolean} success - Indicates whether the request was successful.
     *   - {Object} errors - An object containing error messages, if any.
     *   - {Object} meta - Metadata returned from the API.
     */
    async setRequests(options) {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.pacbio.requests
      const promise = request.get({ ...options })
      const response = await handleResponse(promise)

      const {
        body: { data = {}, meta = {} },
        success,
        errors = {},
      } = response

      if (success) {
        this.requests = dataToObjectById({ data, includeRelationships: false })
      }
      return { success, errors, meta }
    },

    /**
     * Updates a request in the store by sending the updated data to the API.
     *
     * @param {Object} payload - The payload containing the updated request data, including id, library_type, estimate_of_gb_required, number_of_smrt_cells, and cost_code.
     * @returns {Promise<Object>} A promise that resolves to an object containing:
     *   - {boolean} success - Indicates whether the request was successful.
     *   - {Object} errors - An object containing error messages, if any.
     */
    async updateRequest(payload) {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.pacbio.requests
      const requestPayload = createRequestPayload(payload)
      const promise = request.update(requestPayload)
      const response = await handleResponse(promise)

      const {
        body: { data = {} },
        success,
        errors = {},
      } = response

      if (success) {
        this.requests[data.id] = extractAttributes(data)
      }

      return { success, errors }
    },
  },
})

export default usePacbioRequestsStore
