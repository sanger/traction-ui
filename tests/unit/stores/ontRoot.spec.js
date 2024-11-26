import useOntRootStore from '@/stores/ontRoot'
import useRootStore from '@/stores'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout'
import { createPinia, setActivePinia } from '@support/testHelper'
import { beforeEach, describe } from 'vitest'
import OntInstrumentsFactory from '@tests/factories/OntInstrumentsFactory.js'
import OntRunFactory from '@tests/factories/OntRunFactory.js'

const ontInstrumentsFactory = OntInstrumentsFactory()
const ontRunFactory = OntRunFactory()

describe('useOntRootStore', () => {
  beforeEach(() => {
    /*Creates a fresh pinia instance and make it active so it's automatically picked
    up by any useStore() call without having to pass it to it for e.g `useStore(pinia)`*/
    const pinia = createPinia()
    setActivePinia(pinia)
  })

  describe('state', () => {
    it('should have an empty resources on initial load', () => {
      const store = useOntRootStore()
      expect(store.resources.runs).toEqual({})
      expect(store.resources.instruments).toEqual({})
    })
  })
  describe('getters', () => {
    let resources
    beforeEach(() => {
      const instruments = ontInstrumentsFactory.storeData.instruments
      const runs = ontRunFactory.storeData.runs
      resources = {
        instruments,
        runs,
      }
    })
    it('"instruments" returns "state.resources.instruments"', () => {
      const store = useOntRootStore()
      store.resources = resources
      const actual = store.instruments

      const expected = Object.values(store.resources.instruments).map((i) => {
        const instrumentConfig = InstrumentFlowcellLayout[i.instrument_type]
        return {
          ...i,
          ...instrumentConfig,
        }
      })

      expect(actual).toEqual(expected)
    })
    it('"runs" returns "state.resources.runs"', () => {
      const store = useOntRootStore()
      store.resources = resources
      const actual = store.runs
      const expected = Object.values(store.resources.runs).map((r) => {
        const instrument = Object.values(store.resources.instruments).find(
          (i) => i.id == r.ont_instrument_id,
        )
        return {
          ...r,
          instrument_name: `${instrument.name} (${instrument.instrument_type})`,
        }
      })
      expect(actual).toEqual(expected)
    })
  })
  describe('actions', () => {
    const failedResponse = {
      data: { data: [] },
      status: 500,
      statusText: 'Internal Server Error',
    }

    describe('fetchOntRuns', () => {
      it('runs successfully', async () => {
        const rootStore = useRootStore()
        const get = vi.fn()
        get.mockResolvedValue(ontRunFactory.responses.fetch)
        rootStore.api.v2 = { traction: { ont: { runs: { get } } } }

        const store = useOntRootStore()
        const { success } = await store.fetchOntRuns()

        expect(store.resources.runs).toEqual(ontRunFactory.storeData.runs)
        expect(store.resources.instruments).toEqual(ontRunFactory.storeData.instruments)
        expect(success).toBeTruthy()
        expect(get).toHaveBeenCalled()
      })

      it('handles failure', async () => {
        //Mock useroot store
        const rootStore = useRootStore()
        const get = vi.fn()
        get.mockRejectedValue(failedResponse)
        rootStore.api.v2 = { traction: { ont: { runs: { get } } } }

        const store = useOntRootStore()

        // apply action
        const { success } = await store.fetchOntRuns()
        expect(store.resources.instruments).toEqual({})
        expect(store.resources.runs).toEqual({})
        expect(success).toBeFalsy()
      })
    })
    describe('setInstruments', () => {
      it('runs successfully', async () => {
        const rootStore = useRootStore()
        const get = vi.fn()
        get.mockResolvedValue(ontInstrumentsFactory.responses.fetch)
        rootStore.api.v2 = { traction: { ont: { instruments: { get } } } }

        const store = useOntRootStore()
        const { success } = await store.setInstruments()
        expect(store.resources.instruments).toEqual(ontInstrumentsFactory.storeData.instruments)
        expect(success).toBeTruthy()
        expect(get).toHaveBeenCalled()
      })
      it('handles failure', async () => {
        //Mock useroot store
        const rootStore = useRootStore()
        const get = vi.fn()
        get.mockRejectedValue(failedResponse)
        rootStore.api.v1 = { traction: { ont: { instruments: { get } } } }

        const store = useOntRootStore()

        // apply action
        const { success } = await store.setInstruments()
        expect(store.resources.instruments).toEqual({})
        expect(success).toBeFalsy()
      })
    })
  })
})
