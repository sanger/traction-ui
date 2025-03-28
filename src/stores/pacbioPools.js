import { defineStore } from 'pinia'
import useRootStore from '@/stores'
import { handleResponse } from '@/api/ResponseHelper.js'
import { groupIncludedByResource, dataToObjectById } from '@/api/JsonApi.js'
import { addUsedAliquotsBarcodeAndErrorsToPools } from '@/stores/utilities/pacbioPool.js'

/**
 * This store manages the state of PacBio pools which are fetched from the API and used in the PacBio pools page table.
 * It contains the pools, tubes, used_aliquots, requests, and tags state properties, and the fetchPools action.
 * @exports usePacbioPools
 */
export const usePacbioPoolsStore = defineStore('pacbioPools', {
  state: () => ({
    pools: {},
    used_aliquots: {},
    requests: {},
    tags: {},
    libraries: {},
  }),
  getters: {
    /**
     * This function takes a `state` object and returns an array of pools.
     * It maps over the values of `state.pools`, retrieves the used_aliquots and run suitability for each pool, and
     * returns the pools with the retrieved data.
     * The used_aliquots for each pool are retrieved by mapping over the `pool.used_aliquots`, retrieving the used_aliquot data from `state.used_aliquots`
     * based on the used_aliquot ID, and returning the used_aliquot data with the sample name from `state.requests` and the group ID from `state.tags`.
     * The run suitability for each pool is retrieved from `pool.run_suitability` and formatted with the `buildRunSuitabilityErrors` function.
     *
     * @param {Object} state - The state object.
     * @returns {Object[]} The array of pools with the retrieved data.
     */
    poolsArray: (state) => {
      return addUsedAliquotsBarcodeAndErrorsToPools(state)
    },
  },
  actions: {
    /**
     * This asynchronous function fetches pools from the API, processes the response, and updates the state with the fetched data.
     * It takes a `filter` and a `page` as parameters, sends a GET request to the API with the parameters and some additional options, and waits for the response.
     * The response is then handled with the `handleResponse` function.
     * If the response is successful, the included data is grouped by resource with the `groupIncludedByResource` function, and the state is updated with the data.
     *
     * @async
     * @param {Object} filter - The filter for the request.
     * @param {number} page - The page for the request.
     * @returns {Promise<Object>} A promise that resolves to an object with the success status, errors, and meta data of the response.
     */
    async fetchPools(filter = {}, page = {}) {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.pacbio.pools
      const promise = request.get({
        page,
        filter,
        include: 'used_aliquots.tag,used_aliquots.source,libraries.request',
        fields: {
          requests: 'sample_name',
          tags: 'group_id',
        },
      })
      const response = await handleResponse(promise)

      const { success, body: { data, included = [], meta = {} } = {}, errors = [] } = response
      if (success) {
        const { aliquots, tags, requests, libraries } = groupIncludedByResource(included)

        this.libraries = dataToObjectById({ data: libraries })
        this.pools = dataToObjectById({ data, includeRelationships: true })
        this.tags = dataToObjectById({ data: tags })
        this.requests = dataToObjectById({ data: requests })
        this.used_aliquots = dataToObjectById({ data: aliquots, includeRelationships: true })
      }
      return { success, errors, meta }
    },
  },
})
