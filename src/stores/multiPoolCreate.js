import { defineStore } from 'pinia'
import { handleResponse } from '@/api/ResponseHelper.js'
import useRootStore from '@/stores'
import { dataToObjectById, extractAttributes, groupIncludedByResource } from '@/api/JsonApi.js'

export const useMultiPoolCreateStore = defineStore('multiPoolCreate', {
  state: () => ({
    multiPool: {},
    multiPoolPositions: {},
  }),
  getters: {
    multiPoolPositionItems: (state) => {
      return Object.values(state.multiPoolPositions)
    },
  },
  actions: {
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
        this.multiPoolPositions = dataToObjectById({
          data: multi_pool_positions,
          includeRelationships: true,
        })
      }

      return { success, errors }
    },

    /**
     * Sets the current multi pool. If it is a new multi pool it will be created.
     * If it is an existing multi pool it will be updated.
     * @param id The id of the multi pool. It will be new or existing
     * @returns { Object } { success, errors }.
     */
    async setMultiPool({ id }) {
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

    // Reset the store data
    clearData() {
      this.$reset()
    },
  },
})
