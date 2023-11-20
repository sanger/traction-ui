import { defineStore } from 'pinia'
import { handleResponse } from '@/api/ResponseHelper'
import useRootStore from '@/stores'
import useOntRootStore from '@/stores/ontRoot'
import store from '@/store'

export const useOntRunsStore = defineStore('ontRuns', {
  state: () => ({
    currentRun: {
      flowcell_attributes: [],
      id: 'new',
      state: null,
      instrument_name: null,
    },
  }),
  getters: {
    runRequest: () => {
      const rootStore = useRootStore()
      return rootStore.api.traction.ont.runs
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
      const ontRootStore = useOntRootStore()
      const run = this.currentRun
      const request = this.runRequest

      const existingInstruments = ontRootStore.instruments
      const instrument_id = existingInstruments.find((i) => i.name == run.instrument_name).id

      //TODO: This need to be refactored to use the Pinia once ont/ppols is migrated
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

      const promise = request.create({ data: runPayload })
      return await handleResponse(promise)
    },
    async updateRun() {
      const run = this.currentRun
      const request = this.runRequest

      const ontRootStore = useOntRootStore()
      const existingInstruments = ontRootStore.instruments
      const instrument_id = existingInstruments.find((i) => i.name == run.instrument_name).id

      //TODO: This need to be refactored to use the Pinia once ont/ppols is migrated
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
          id: run.id,
          attributes: {
            ont_instrument_id: instrument_id,
            state: run.state,
            flowcell_attributes: flowcell_attributes,
          },
        },
      }

      const promise = request.update(runPayload)
      return await handleResponse(promise)
    },
    async fetchRun(runId) {
      const request = this.runRequest
      const promise = request.find({ id: runId, include: 'flowcells' })
      const response = await handleResponse(promise)

      const { success, data: { data, included = [] } = {}, errors = [] } = response

      if (success && !data.empty) {
        const ontRootStore = useOntRootStore()
        const existingInstruments = ontRootStore.instruments
        const instrument_name = existingInstruments.find(
          (i) => i.id == data.attributes.ont_instrument_id,
        ).name

        //TODO: This need to be refactored to use the Pinia once ont/ppols is migrated
        const existingPools = store.getters['traction/ont/pools/pools']

        const currentRun = {
          id: data.id,
          instrument_name: instrument_name,
          state: data.attributes.state,
          flowcell_attributes: included.map((fc) => {
            const tube_barcode = existingPools.find(
              (p) => p.id == fc.attributes.ont_pool_id,
            ).barcode

            return {
              flowcell_id: fc.attributes.flowcell_id,
              ont_pool_id: fc.attributes.ont_pool_id,
              position: fc.attributes.position,
              tube_barcode: tube_barcode,
            }
          }),
        }
        this.currentRun = currentRun
        return { success, errors }
      }
    },
    setInstrumentName(name) {
      this.currentRun.instrument_name = name
    },
    setState(state) {
      this.currentRun.state = state
    },
    setFlowcellId(obj) {
      const exists = this.currentRun.flowcell_attributes.find(
        (flowcell) => flowcell.position == obj.position,
      )

      if (exists) {
        exists['flowcell_id'] = obj.$event
      } else {
        const flowcell = { flowcell_id: obj.$event, position: obj.position }
        this.currentRun.flowcell_attributes.push(flowcell)
      }
    },
    setPoolTubeBarcode(obj) {
      const exists = this.currentRun.flowcell_attributes.find(
        (flowcell) => flowcell.position == obj.position,
      )

      if (exists) {
        exists['tube_barcode'] = obj.barcode
      } else {
        const flowcell = { tube_barcode: obj.barcode, position: obj.position }
        this.currentRun.flowcell_attributes.push(flowcell)
      }
    },
    setCurrentRun(run) {
      this.currentRun = run
    },
  },
})
