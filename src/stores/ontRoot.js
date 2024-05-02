import { defineStore } from 'pinia'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout'
import { handleResponse } from '@/api/v1/ResponseHelper'
import { groupIncludedByResource, dataToObjectById } from '@/api/JsonApi'
import useRootStore from '@/stores'

/**
 * Generates an object describing the shared ONT resources for use in the vuex
 * store
 */

// Helper function for reformatting data
const formatById = (obj, data, includeRelationships = false) => {
  return {
    ...obj,
    ...dataToObjectById({ data, includeRelationships }),
  }
}
const useOntRootStore = defineStore('ontRoot', {
  state: () => ({
    // Resources returned by the server, each key represents a resource type.
    // resource types are indexed by their id.
    resources: {
      // The main source of run information. runs are indexed by id.
      runs: {},
      // The main source of instrument information. instrument are indexed by id.
      instruments: {},
    },
  }),
  getters: {
    runs: (state) => {
      try {
        return Object.values(state.resources.runs).map((r) => {
          const instrument = Object.values(state.resources.instruments).find(
            (i) => i.id == r.ont_instrument_id,
          )
          return {
            ...r,
            instrument_name: `${instrument.name} (${instrument.instrument_type})`,
          }
        })
      } catch {
        return []
      }
    },
    instruments: (state) => {
      try {
        return Object.values(state.resources.instruments).map((i) => {
          const instrumentConfig = InstrumentFlowcellLayout[i.instrument_type]
          return {
            ...i,
            ...instrumentConfig,
          }
        })
      } catch {
        return []
      }
    },
    instrumentByName: (state) => (name) => {
      return state.instruments.find((i) => i.name == name)
    },
  },
  actions: {
    /**
     * Retrieves a list of ont runs from traction-service and populates the source
     * with associated instrument data
     * @param rootState the vuex rootState object. Provides access to the current state
     * @param commit the vuex commit object. Provides access to mutations
     */
    async fetchOntRuns(filter, page) {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.ont.runs
      const promise = request.get({ page, filter, include: 'instrument' })

      const response = await handleResponse(promise)

      const { success, data: { data, included = [], meta = {} } = {}, errors = [] } = response
      const { instruments } = groupIncludedByResource(included)

      if (success) {
        this.resources.runs = formatById(this.resources.runs, data, true)
        this.resources.instruments = formatById(this.resources.instruments, instruments, true)
      }

      return { success, errors, meta }
    },
    async setInstruments() {
      const rootStore = useRootStore()
      const request = rootStore.api.traction.ont.instruments
      const promise = request.get()
      const response = await handleResponse(promise)
      const { success, data: { data } = {}, errors = [] } = response

      if (success) {
        this.resources.instruments = formatById(this.resources.instruments, data)
      }
      return { success, errors, response }
    },
  },
})
export default useOntRootStore
