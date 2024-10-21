import { defineStore } from 'pinia'
import { handleResponse } from '@/api/v2/ResponseHelper'
import { dataToObjectById, extractAttributes } from '@/api/JsonApi'
import store from '@/store'

export const usePacbioRunsStore = defineStore('pacbioRuns', {
  state: () => ({
    runs: [],
  }),
  getters: {
    runsArray: (state) => Object.values(state.runs),
    /*Pinia_migration_todo: This is migrated from the VueX store now, but it can be changed to a Pinia store, 
     once the VueX root store is converted to Pinia*/
    runRequest: () => store.state.api.v2.traction.pacbio.runs,
  },

  actions: {
    async fetchPacbioRuns(filter, page) {
      const promise = this.runRequest.get({ page, filter, include: 'plates' })
      const response = await handleResponse(promise)
      const { success, body: { data, included = [], meta = {} } = {}, errors = [] } = response

      //TODO:- Two calls to dataToObjectById method - optimization or refactoring required?
      const platesById = dataToObjectById({ data: included })

      if (success) {
        // Concatenate SKBB info for a run
        // this is a bit of a code smell. We shoud either do this in the API or in the view.
        // It is difficult to use the factories to do this.
        data.map((run) => {
          const runPlateIds = run.relationships.plates.data.map((p) => p.id)
          const sequencing_kit_box_barcodes = runPlateIds.map((plateId) => {
            const plate = platesById[plateId]
            return `Plate ${plate.plate_number}: ${plate.sequencing_kit_box_barcode}`
          })
          run.attributes.sequencing_kit_box_barcodes = sequencing_kit_box_barcodes
        })
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
      //TODO:- This is a call to the VueX store - optimization or refactoring required?
      const promise = this.runRequest.update(payload)
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
