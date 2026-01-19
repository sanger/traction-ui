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
  },
})
