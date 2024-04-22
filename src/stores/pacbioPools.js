import { defineStore } from 'pinia'
import useRootStore from '@/stores'
import { handleResponse } from '@/api/ResponseHelper.js'
import { groupIncludedByResource, dataToObjectById } from '@/api/JsonApi.js'

/**
 * This function takes an object with `pool` and `used_aliquots` properties and returns an array of run suitability errors.
 * It maps over the errors of `pool.run_suitability` and `used_aliquot.run_suitability` for each used_aliquot, formats the errors with the pool or used_aliquot details, and returns the formatted errors.
 *
 * @param {Object}  - An object with `pool` and `used_aliquots` properties.
 * @returns {string[]} The formatted run suitability errors.
 */
const buildRunSuitabilityErrors = ({ pool, used_aliquots }) => [
  ...pool.run_suitability.errors.map(({ detail }) => `Pool ${detail}`),
  ...used_aliquots.flatMap((used_aliquot) => {
    const used_aliquotName = `Used aliquot ${used_aliquot.id} (${used_aliquot.sample_name})`
    return used_aliquot.run_suitability.errors.map(({ detail }) => `${used_aliquotName} ${detail}`)
  }),
]
/**
 * This store manages the state of PacBio pools which are fetched from the API and used in the PacBio pools page table.
 * It contains the pools, tubes, used_aliquots, requests, and tags state properties, and the fetchPools action.
 * @exports usePacbioPools
 */
export const usePacbioPoolsStore = defineStore('pacbioPools', {
  state: () => ({
    pools: {},
    tubes: {},
    used_aliquots: {},
    requests: {},
    tags: {},
    libraries: {},
  }),
  getters: {
    /**
     * This function takes a `state` object and returns an array of pools.
     * It maps over the values of `state.pools`, retrieves the used_aliquots, barcode, and run suitability for each pool, and
     * returns the pools with the retrieved data.
     * The used_aliquots for each pool are retrieved by mapping over the `pool.used_aliquots`, retrieving the used_aliquot data from `state.used_aliquots`
     * based on the used_aliquot ID, and returning the used_aliquot data with the sample name from `state.requests` and the group ID from `state.tags`.
     * The barcode for each pool is retrieved from `state.tubes` based on the `pool.tube`.
     * The run suitability for each pool is retrieved from `pool.run_suitability` and formatted with the `buildRunSuitabilityErrors` function.
     *
     * @param {Object} state - The state object.
     * @returns {Object[]} The array of pools with the retrieved data.
     */
    poolsArray: (state) => {
      return Object.values(state.pools).map((pool) => {
        const used_aliquots = pool.used_aliquots.map((used_aliquotId) => {
          const { id, type, source_id, source_type, tag, run_suitability } =
            state.used_aliquots[used_aliquotId]
          // Get the sample name based on the source_type
          const { sample_name } =
            source_type === 'Pacbio::Request'
              ? state.requests[source_id]
              : state.requests[state.libraries[source_id]?.pacbio_request_id]
          const { group_id } = state.tags[tag] || {}
          return { id, type, sample_name, group_id, run_suitability }
        })
        const { barcode } = state.tubes[pool.tube]
        return {
          ...pool,
          used_aliquots,
          barcode,
          run_suitability: {
            ...pool.run_suitability,
            formattedErrors: buildRunSuitabilityErrors({ used_aliquots, pool }),
          },
        }
      })
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
    async fetchPools(filter, page) {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.pacbio.pools
      const promise = request.get({
        page,
        filter,
        include: 'tube,used_aliquots.tag,used_aliquots.source,libraries.request',
        fields: {
          requests: 'sample_name',
          tubes: 'barcode',
          tags: 'group_id',
        },
      })
      const response = await handleResponse(promise)

      const { success, data: { data, included = [], meta = {} } = {}, errors = [] } = response
      if (success) {
        const { tubes, aliquots, tags, requests, libraries } = groupIncludedByResource(included)

        this.libraries = dataToObjectById({ data: libraries })
        this.pools = dataToObjectById({ data, includeRelationships: true })
        this.tubes = dataToObjectById({ data: tubes })
        this.tags = dataToObjectById({ data: tags })
        this.requests = dataToObjectById({ data: requests })
        this.used_aliquots = dataToObjectById({ data: aliquots, includeRelationships: true })
      }
      return { success, errors, meta }
    },
  },
})
