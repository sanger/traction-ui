import { defineStore } from 'pinia'
import { handleResponse } from '@/api/v2/ResponseHelper'
import { groupIncludedByResource, dataToObjectById } from '@/api/JsonApi'
import useRootStore from '@/stores'
import useOntRootStore from '@/stores/ontRoot'
import { flowCellType } from '@/stores/utilities/flowCell'
import { buildFormatedOntRun } from '@/stores/utilities/ontRuns'

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
  const ontRootStore = useOntRootStore()
  const existingInstruments = ontRootStore.instruments
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
        flowcell_attributes: flowcell_attributes,
      },
    },
  }
  return runPayload
}
export const useOntRunsStore = defineStore('ontRuns', {
  state: () => ({
    currentRun: {
      flowcell_attributes: [],
      id: 'new',
      state: null,
      instrument_name: null,
    },
    pools: {},
    tubes: {},
  }),
  getters: {
    runRequest: () => {
      const rootStore = useRootStore()
      return rootStore.api.v2.traction.ont.runs
    },
    getFlowCell: (state) => (position) => {
      return state.currentRun.flowcell_attributes.find((fc) => fc.position == position)
    },
  },
  actions: {
    newRun() {
      this.currentRun = {
        id: 'new',
        instrument_name: null,
        state: null,
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
        const ontRootStore = useOntRootStore()
        const existingInstruments = ontRootStore.instruments

        const { pools } = groupIncludedByResource(included)
        this.pools = formatById(this.pools, pools, true)

        this.currentRun = buildFormatedOntRun(existingInstruments, this.pools, data, included)
        return { success, errors }
      }
    },
    async fetchPool(barcode) {
      // Here we want to make sure the barcode exists
      // If it doesn't, set success to null for component validation
      if (!barcode || barcode.trim() === '') {
        return {
          success: true,
        }
      }
      const rootStore = useRootStore()
      const request = rootStore.api.v2.traction.ont.pools
      const promise = request.get({ filter: { barcode } })
      const response = await handleResponse(promise)
      let { success, body: { data } = {} } = response

      if (success && !data.empty) {
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
