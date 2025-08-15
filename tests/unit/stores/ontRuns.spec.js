import { useOntRunsStore } from '@/stores/ontRuns.js'
import useRootStore from '@/stores'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout.json'
import { beforeEach, describe } from 'vitest'
import OntInstrumentFactory from '@tests/factories/OntInstrumentFactory.js'
import OntRunFactory from '@tests/factories/OntRunFactory.js'
import { failedResponse } from '@tests/support/testHelper.js'

const ontInstrumentFactory = OntInstrumentFactory()
const ontRunFactory = OntRunFactory()

describe('useOntRunsStore', () => {
  let store, rootStore

  beforeEach(() => {
    rootStore = useRootStore()
    store = useOntRunsStore()
  })

  describe('getters', () => {
    // this test is testing implementation i.e. the function itself
    it('"instruments" returns "state.resources.instruments"', () => {
      store.$state.resources.instruments = ontInstrumentFactory.storeData.instruments
      const expected = Object.values(store.resources.instruments).map((i) => {
        const instrumentConfig = InstrumentFlowcellLayout[i.instrument_type]
        return {
          ...i,
          ...instrumentConfig,
        }
      })

      expect(store.instruments).toEqual(expected)
    })

    // this test is testing implementation i.e. the function itself
    it('"runs" returns "state.resources.runs"', () => {
      store.$state.resources = {
        runs: ontRunFactory.storeData.runs,
        instruments: ontInstrumentFactory.storeData.instruments,
      }
      const expected = Object.values(store.resources.runs).map((r) => {
        const instrument = Object.values(store.resources.instruments).find(
          (i) => i.id == r.ont_instrument_id,
        )
        return {
          ...r,
          instrument_name: `${instrument.name} (${instrument.instrument_type})`,
        }
      })
      expect(store.runs).toEqual(expected)
    })
  })
  describe('actions', () => {
    describe('fetchOntRuns', () => {
      it('runs successfully', async () => {
        const get = vi.fn()
        get.mockResolvedValue(ontRunFactory.responses.fetch)
        rootStore.api = { traction: { ont: { runs: { get } } } }

        const { success } = await store.fetchOntRuns()

        expect(success).toBeTruthy()
        expect(store.resources.runs).toEqual(ontRunFactory.storeData.runs)
      })

      it('handles failure', async () => {
        const get = vi.fn()
        get.mockRejectedValue(failedResponse())
        rootStore.api = { traction: { ont: { runs: { get } } } }

        const { success } = await store.fetchOntRuns()
        expect(success).toBeFalsy()
        expect(store.resources.runs).toEqual({})
      })
    })

    describe('fetchInstruments', () => {
      it('runs successfully', async () => {
        const get = vi.fn()
        get.mockResolvedValue(ontInstrumentFactory.responses.fetch)
        rootStore.api = { traction: { ont: { instruments: { get } } } }

        const { success } = await store.fetchInstruments()
        expect(success).toBeTruthy()
        expect(store.resources.instruments).toEqual(ontInstrumentFactory.storeData.instruments)
      })
      it('handles failure', async () => {
        const get = vi.fn()
        get.mockRejectedValue(failedResponse)
        rootStore.api = { traction: { ont: { instruments: { get } } } }

        const { success } = await store.fetchInstruments()
        expect(success).toBeFalsy()
        expect(store.resources.instruments).toEqual({})
      })
    })
  })
})
