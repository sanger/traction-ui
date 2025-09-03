import { defineStore } from 'pinia'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout.json'
import { handleResponse } from '@/api/ResponseHelper.js'
import { groupIncludedByResource, dataToObjectById } from '@/api/JsonApi.js'
import useRootStore from '@/stores'

/**
 * Generates an object describing the shared ONT resources for use in the
 * store
 */

// Helper function for reformatting data
const formatById = (obj, data, includeRelationships = false) => {
  return {
    ...obj,
    ...dataToObjectById({ data, includeRelationships }),
  }
}
export const useOntRunsStore = defineStore('ontRuns', {
  state: () => ({
    // Resources returned by the server, each key represents a resource type.
    // resource types are indexed by their id.
    resources: {
      // The main source of run information. runs are indexed by id.
      runs: {},
      // The main source of instrument information. instrument are indexed by id.
      instruments: {},
    },
  }),
  getters: {
    runs: (state) => {
      try {
        return Object.values(state.resources.runs).map((r) => {
          const instrument = Object.values(state.resources.instruments).find(
            (i) => i.id == r.ont_instrument_id,
          )
          return {
            ...r,
            instrument_name: `${instrument.name} (${instrument.instrument_type})`,
          }
        })
      } catch {
        return []
      }
    },
    instruments: (state) => {
      try {
        return Object.values(state.resources.instruments).map((i) => {
          const instrumentConfig = InstrumentFlowcellLayout[i.instrument_type]
          return {
            ...i,
            ...instrumentConfig,
          }
        })
      } catch {
        return []
      }
    },
    instrumentByName: (state) => (name) => {
      return state.instruments.find((i) => i.name == name)
    },
  },
  actions: {
    /**
     * Retrieves a list of ont runs from traction-service and populates the source
     * with associated instrument data
     * @param rootState the root state object. Provides access to the current state
     * @param commit the commit object. Provides access to mutations
     */
    /**
     * Fetches a list of ONT runs from the API and updates the store state with runs and associated instruments.
     *
     * @async
     * @param {Object} filter - Filter parameters to apply to the runs query (e.g., { state: 'complete' }).
     * @param {number} [page] - The page number for paginated results.
     * @returns {Object} An object containing:
     *   - success {boolean}: Whether the API request was successful.
     *   - errors {Object}: Any errors returned from the API.
     *   - meta {Object}: Metadata from the API response (e.g., pagination info).
     *
     * @description
     * This action sends a GET request to the ONT runs API endpoint, including associated instrument data.
     * If the request is successful, it updates the store's `resources.runs` and `resources.instruments` state
     * with the returned run and instrument data, formatted by ID.
     * The function returns an object with the success status, any errors, and response metadata.
     *
     * @example
     * const { success, errors, meta } = await fetchOntRuns({ state: 'complete' }, 1)
     * if (success) {
     *   // Access runs via store.resources.runs and instruments via store.resources.instruments
     * }
     */
    async fetchOntRuns(filter, page) {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.ont.runs
      const promise = request.get({ page, ...filter, include: 'instrument' })

      const response = await handleResponse(promise)

      const { success, body: { data, included = [], meta = {} } = {}, errors = {} } = response
      const { instruments } = groupIncludedByResource(included)

      if (success) {
        this.resources.runs = formatById(this.resources.runs, data, true)
        this.resources.instruments = formatById(this.resources.instruments, instruments, true)
      }

      return { success, errors, meta }
    },
    /**
     * Fetches the list of ONT instruments from the API and updates the store state.
     *
     * @async
     * @returns {Object} An object containing:
     *   - success {boolean}: Whether the API request was successful.
     *   - errors {Object}: Any errors returned from the API.
     *   - response {Object}: The full API response object.
     *
     * @description
     * This action sends a GET request to the ONT instruments API endpoint.
     * If the request is successful, it updates the store's `resources.instruments` state
     * with the returned instrument data, formatted by ID.
     * The function returns an object with the success status, any errors, and the full response.
     *
     * @example
     * const { success, errors } = await fetchInstruments()
     * if (success) {
     *   // Access instruments via store.resources.instruments
     * }
     */
    async fetchInstruments() {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.ont.instruments
      const promise = request.get()
      const response = await handleResponse(promise)
      const { success, body: { data } = {}, errors = {} } = response

      if (success) {
        this.resources.instruments = formatById(this.resources.instruments, data)
      }
      return { success, errors, response }
    },
  },
})
