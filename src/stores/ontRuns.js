import { defineStore } from 'pinia'
import { handleResponse } from '@/api/v2/ResponseHelper'
import useRootStore from '@/stores'
import useOntRootStore from '@/stores/ontRoot'
import store from '@/store'
import { flowCellType } from '@/stores/utilities/flowCell'
import { buildFormattedOntRun } from '@/stores/utilities/ontRuns'

/**
 *
 * @param {*} run  the run object
 * @returns {Object} payload for the create/update run request
 * @field {Object} data - the payload for the request
 * Note:-
 * The payload returned doesn't have the id field as it is not required for create request
 * and for update request the id field is added in the updateRun action
 */
function createPayload(run) {
  const ontRootStore = useOntRootStore()
  const existingInstruments = ontRootStore.instruments
  const instrument_id = existingInstruments.find((i) => i.name == run.instrument_name).id

  //TODO: This need to be refactored to use the Pinia once ont/pools is migrated
  const existingPools = store.getters['traction/ont/pools/pools']

  const flowcell_attributes = run.flowcell_attributes
    .filter((fc) => fc.flowcell_id && fc.tube_barcode)
    .map((fc) => {
      const pool = existingPools.find((p) => p.barcode == fc.tube_barcode)
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
      flowcell_attributes: [flowCellType],
      id: 'new',
      state: null,
      instrument_name: null,
    },
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
        flowcell_attributes: [flowCellType],
      }
    },
    async createRun() {
      const promise = this.runRequest.create({ data: createPayload(this.currentRun) })
      return await handleResponse(promise)
    },
    async updateRun() {
      //Add id field to the payload for update
      const payload = {
        data: {
          id: this.currentRun.id,
          ...createPayload(this.currentRun).data,
        },
      }
      const promise = this.runRequest.update(payload)
      return await handleResponse(promise)
    },
    async fetchRun(runId) {
      const request = this.runRequest
      const promise = request.find({ id: runId, include: 'flowcells' })
      const response = await handleResponse(promise)

      const { success, body: { data, included = [] } = {}, errors = {} } = response

      if (success && !data.empty) {
        const ontRootStore = useOntRootStore()
        const existingInstruments = ontRootStore.instruments

        //TODO: This need to be refactored to use the Pinia once ont/pools is migrated
        const existingPools = store.getters['traction/ont/pools/pools']

        this.currentRun = buildFormattedOntRun(existingInstruments, existingPools, data, included)
        return { success, errors }
      }
    },
    setInstrumentName(name) {
      this.currentRun.instrument_name = name
    },
    setState(state) {
      this.currentRun.state = state
    },
    setNewFlowCell(position) {
      this.currentRun.flowcell_attributes.push({
        ...flowCellType,
        position,
      })
    },
    setFlowcellId(obj) {
      const flowCellObj = this.getFlowCell(obj.position)
      if (flowCellObj) {
        flowCellObj['flowcell_id'] = obj.$event
      } else {
        const flowcell = { ...flowCellType, flowcell_id: obj.$event, position: obj.position }
        this.currentRun.flowcell_attributes.push(flowcell)
      }
    },
    setPoolTubeBarcode(obj) {
      const flowCellObj = this.getFlowCell(obj.position)
      if (flowCellObj) {
        flowCellObj['tube_barcode'] = obj.barcode
      } else {
        const flowcell = { ...flowCellType, tube_barcode: obj.barcode, position: obj.position }
        this.currentRun.flowcell_attributes.push(flowcell)
      }
    },
    setCurrentRun(run) {
      this.currentRun = run
    },
  },
})
