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
        this.requestsArray[request.id] = extractAttributes(data)
      }

      return { success, errors }
    },
  },
})

export default usePacbioRequestsStore
