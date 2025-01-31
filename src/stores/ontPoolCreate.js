import { defineStore } from 'pinia'
// import { handleResponse } from '@/api/ResponseHelper.js'
// import { groupIncludedByResource, dataToObjectById, extractAttributes } from '@/api/JsonApi.js'
// import useRootStore from '@/stores'
// import { useOntRootStore } from '@/stores/ontRoot.js'

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
    },
  }),
  getters: {
    /**
     * Returns the requests
     * @param {Object} state The Vuex state object
     */
    requests: (state) => Object.values(state.resources.requests),
  },
  actions: {},
})
