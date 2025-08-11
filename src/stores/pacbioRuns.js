import { defineStore } from 'pinia'
import { handleResponse } from '@/api/ResponseHelper.js'
import useRootStore from '@/stores'
import { dataToObjectById, extractAttributes } from '@/api/JsonApi.js'

export const usePacbioRunsStore = defineStore('pacbioRuns', {
  state: () => ({
    runs: [],
  }),
  getters: {
    runsArray: (state) => Object.values(state.runs),
    /*Pinia_migration_todo: This is migrated from the VueX store now, but it can be changed to a Pinia store, 
     once the VueX root store is converted to Pinia*/
    runRequest: () => {
      const rootStore = useRootStore()
      return rootStore.state.api.traction.pacbio.runs
    },
  },

  actions: {
    async fetchPacbioRuns(filter = {}, page = {}) {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.pacbio.runs
      const promise = request.get({ page, filter })
      const response = await handleResponse(promise)
      const { success, body: { data, meta = {} } = {}, errors = [] } = response

      if (success) {
        this.runs = dataToObjectById({ data, includeRelationships: true })
      }
      return { success, errors, meta }
    },

    /**
     * Updates an existing run
     * @returns {Object} { success, errors }. Was the request successful? were there any errors?
     */
    async updateRun({ id, ...attributes }) {
      const payload = {
        data: {
          id: id,
          type: 'runs',
          attributes: { ...attributes },
        },
      }

      const rootStore = useRootStore()
      const request = rootStore.api.traction.pacbio.runs
      const promise = request.update(payload)
      const response = await handleResponse(promise)

      const { success, body: { data } = {}, errors = [] } = response

      if (success) {
        // This updates the store to reflect the state change
        this.runs[data.id] = extractAttributes(data)
      }

      return { success, errors }
    },
  },
})
