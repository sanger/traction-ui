import { defineStore } from 'pinia'
import { handleResponse } from '@/api/ResponseHelper.js'
import { groupIncludedByResource, dataToObjectById } from '@/api/JsonApi.js'
import useRootStore from '@/stores'
import { useOntRunsStore } from '@/stores/ontRuns.js'
import { flowCellType } from '@/stores/utilities/flowCell.js'
import { buildFormatedOntRun } from '@/stores/utilities/ontRuns.js'

// Helper function for setting pool and library data
const formatById = (obj, data, includeRelationships = false) => {
  return {
    ...obj,
    ...dataToObjectById({ data, includeRelationships }),
  }
}

/**
 *
 * @param {*} run  the run object
 * @returns {Object} payload for the create/update run request
 * @field {Object} data - the payload for the request
 * Note:-
 * The payload returned doesn't have the id field as it is not required for create request
 * and for update request the id field is added in the updateRun action
 */
function createPayload(run, pools) {
  const ontRunsStore = useOntRunsStore()
  const existingInstruments = ontRunsStore.instruments
  const instrument_id = existingInstruments.find((i) => i.name == run.instrument_name).id

  const flowcell_attributes = run.flowcell_attributes
    .filter((fc) => fc.flowcell_id && fc.tube_barcode)
    .map((fc) => {
      const pool = Object.values(pools).find((p) => p.tube_barcode == fc.tube_barcode)
      const pool_id = pool ? pool.id : ''

      return { ...fc, ...{ ont_pool_id: pool_id } }
    })

  const runPayload = {
    data: {
      type: 'runs',
      attributes: {
        ont_instrument_id: instrument_id,
        state: run.state,
        rebasecalling_process: run.rebasecalling_process,
        flowcell_attributes: flowcell_attributes,
      },
    },
  }
  return runPayload
}
export const useOntRunCreateStore = defineStore('ontRunCreate', {
  state: () => ({
    currentRun: {
      flowcell_attributes: [],
      id: 'new',
      state: null,
      rebasecalling_process: null,
      instrument_name: null,
    },
    pools: {},
    tubes: {},
  }),
  getters: {
    runRequest: () => {
      const rootStore = useRootStore()
      return rootStore.api.traction.ont.runs
    },
    getOrCreateFlowCell: (state) => (position) => {
      // Find the flowcell with the given position
      let flowcell = state.currentRun.flowcell_attributes.find((fc) => fc.position == position)
      // If the flowcell doesn't exist, create a new one
      if (!flowcell) {
        flowcell = { ...flowCellType(), position }
        state.currentRun.flowcell_attributes.push(flowcell)
      }
      return flowcell
    },
  },
  actions: {
    newRun() {
      this.currentRun = {
        id: 'new',
        instrument_name: null,
        state: null,
        rebasecalling_process: null,
        flowcell_attributes: [],
      }
    },
    async createRun() {
      const promise = this.runRequest.create({
        data: createPayload(this.currentRun, this.pools),
      })
      return await handleResponse(promise)
    },
    async updateRun() {
      //Add id field to the payload for update
      const payload = {
        data: {
          id: this.currentRun.id,
          ...createPayload(this.currentRun, this.pools).data,
        },
      }
      const promise = this.runRequest.update(payload)
      return await handleResponse(promise)
    },
    async fetchRun(runId) {
      const request = this.runRequest
      const promise = request.find({ id: runId, include: 'flowcells.pool' })
      const response = await handleResponse(promise)

      const { success, body: { data, included = [] } = {}, errors = {} } = response

      if (success && !data.empty) {
        const ontRunsStore = useOntRunsStore()
        const existingInstruments = ontRunsStore.instruments

        const { pools } = groupIncludedByResource(included)
        this.pools = formatById(this.pools, pools, true)

        this.currentRun = buildFormatedOntRun(existingInstruments, this.pools, data, included)
        return { success, errors }
      }
    },

    /**
     * Fetches a pool by its barcode and adds the pool to the store if it exists.
     *
     * @param {string} barcode - The barcode of the pool to fetch.
     * @returns {Promise<{success: boolean}>} - An object indicating the success of the operation.
     */
    async fetchPool(barcode) {
      // Here we want to make sure the barcode exists
      // If it doesn't, set success to null for component validation
      if (!barcode || barcode.trim() === '') {
        return {
          success: true,
        }
      }
      const rootStore = useRootStore()
      const request = rootStore.api.traction.ont.pools
      const promise = request.get({ filter: { barcode } })
      const response = await handleResponse(promise)
      let { success, body: { data } = {} } = response

      // TODO: data.length check could be refactored into handleResponse to avoid repetition
      // If response is successful and the data is not empty, add the pool to the store
      if (success && data.length > 0) {
        this.pools = {
          ...this.pools,
          ...formatById(this.pools, data),
        }
        return { success }
      }

      return { success: false }
    },
    setInstrumentName(name) {
      this.currentRun.instrument_name = name
    },
    setState(state) {
      this.currentRun.state = state
    },
    setRebasecallingProcess(process) {
      this.currentRun.rebasecalling_process = process
    },
    setNewFlowCell(position) {
      this.currentRun.flowcell_attributes.push({
        ...flowCellType(),
        position,
      })
    },
    setCurrentRun(run) {
      this.currentRun = run
    },
  },
})
