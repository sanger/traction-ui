import { defineStore } from 'pinia'
import { handleResponse } from '@/api/ResponseHelper.js'
import useRootStore from '@/stores'
import { dataToObjectById } from '@/api/JsonApi.js'
import { extractPlatefromData } from '@/stores/utilities/plate.js'

export const usePacbioPlatesStore = defineStore('pacbioPlates', {
  state: () => ({
    plates: {},
  }),

  actions: {
    /**
     * Fetches Pacbio plates from the API and updates the store state.
     *
     * @param {Object} options - Query parameters or filter options for the API request.
     * @returns {Object} An object containing:
     *   - success {boolean}: Whether the API request was successful.
     *   - errors {Object}: Any errors returned from the API.
     *   - meta {Object}: Metadata from the API response.
     *
     * @description
     * This action sends a GET request to the Pacbio plates API endpoint using the provided options.
     * If the request is successful, it transforms the returned plate data into an object keyed by ID
     * (including relationships) and updates the store's `plates` state.
     * The function returns an object with the success status, any errors, and response metadata.
     *
     * @example
     * const { success, errors, meta } = await fetchPlates({ filter: { barcode: '12345' } })
     * if (success) {
     *   // Access plates via store.plates
     * }
     */
    async fetchPlates(options) {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.pacbio.plates
      const promise = request.get({ ...options })
      const response = await handleResponse(promise)

      const {
        body: { data = {}, meta = {} },
        success,
        errors = {},
      } = response

      if (success) {
        this.plates = dataToObjectById({ data, includeRelationships: true })
      }

      return { success, errors, meta }
    },

    /**
     * Finds a Pacbio plate by filter and returns its data with included relationships.
     *
     * @param {Object} filter - The filter object used to search for the plate (e.g., { barcode: '12345' }).
     * @returns {Object} The extracted plate object with wells and requests if found, otherwise an empty object.
     *
     * @description
     * This action sends a GET request to the Pacbio plates API endpoint using the provided filter.
     * It requests the plate along with its wells and associated requests.
     * If the request is successful, it uses `extractPlatefromData` to transform the API response
     * into a plate object with its relationships. If no plate is found, it returns an empty object.
     *
     * @example
     * const plate = await findPlate({ barcode: 'PB12345' })
     * if (plate.id) {
     *   // Use plate data
     * }
     */
    async findPlate(filter) {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.pacbio.plates
      const promise = request.get({ filter, include: 'wells.requests' })
      const response = await handleResponse(promise)
      const {
        success,
        body: { data, included = [] },
      } = response

      if (success) {
        return extractPlatefromData({ data, included })
      }
      return {}
    },
  },
  getters: {
    /**
     * Returns the plates stored in the state.
     *
     * @returns {Object} The plates
     */
    getPlates: (state) => {
      return Object.values(state.plates)
    },
  },
})
