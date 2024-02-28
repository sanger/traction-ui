import { defineStore } from 'pinia'
import useRootStore from '@/stores'
import { handleResponse } from '@/api/ResponseHelper.js'
import { groupIncludedByResource, dataToObjectById } from '@/api/JsonApi.js'

const buildRunSuitabilityErrors = ({ pool, libraries }) => [
  ...pool.run_suitability.errors.map(({ detail }) => `Pool ${detail}`),
  ...libraries.flatMap((library) => {
    const libraryName = `Library ${library.id} (${library.sample_name})`
    return library.run_suitability.errors.map(({ detail }) => `${libraryName} ${detail}`)
  }),
]
export const usePacbioPools = defineStore('pacbioPools', {
  state: () => ({
    pools: {},
    tubes: {},
    libraries: {},
    requests: {},
    tags: {},
  }),
  getters: {
    poolsArray: (state) => {
      return Object.values(state.pools).map((pool) => {
        const libraries = pool.libraries.map((libraryId) => {
          const { id, type, request, tag, run_suitability } = state.libraries[libraryId]
          const { sample_name } = state.requests[request]
          const { group_id } = state.tags[tag] || {}
          return { id, type, sample_name, group_id, run_suitability }
        })
        const { barcode } = state.tubes[pool.tube]

        return {
          ...pool,
          libraries,
          barcode,
          run_suitability: {
            ...pool.run_suitability,
            formattedErrors: buildRunSuitabilityErrors({ libraries, pool }),
          },
        }
      })
    },
  },
  actions: {
    async setPools(filter, page) {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.pacbio.pools
      const promise = request.get({
        page,
        filter,
        include: 'tube,used_aliquots.tag, used_aliquots.request',
        fields: {
          requests: 'sample_name',
          tubes: 'barcode',
          tags: 'group_id',
          libraries: 'request,tag,run_suitability',
        },
      })
      const response = await handleResponse(promise)

      const { success, data: { data, included = [], meta = {} } = {}, errors = [] } = response

      if (success) {
        const { tubes, library_pools, tags, requests } = groupIncludedByResource(included)
        this.pools = dataToObjectById({ data, includeRelationships: true })
        this.tubes = dataToObjectById({ data: tubes })
        this.libraries = dataToObjectById({ data: library_pools, includeRelationships: true })
        this.tags = dataToObjectById({ data: tags })
        this.requests = dataToObjectById({ data: requests })
      }

      return { success, errors, meta }
    },
  },
})
