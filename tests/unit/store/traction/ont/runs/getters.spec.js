import Response from '@/api/Response'
import { Data } from '@support/testHelper'
import getters from '@/store/traction/ont/runs/getters'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout'

describe('getters', () => {
  let state, instruments, rootState

  beforeEach(() => {
    instruments = new Response(Data.OntInstruments).deserialize.instruments

    state = {
      currentRun: { id: 1 },
      instruments: instruments,
      instrumentFlowcellLayout: InstrumentFlowcellLayout,
    }
    rootState = {
      api: { traction: { ont: { runs: 'aRunRequest', instruments: 'aInstrumentRequest' } } },
    }
  })

  it('"currentRun" returns "state.currentRun"', () => {
    const actual = getters.currentRun(state)
    expect(actual).toEqual({ id: 1 })
  })

  it('"runRequest" returns "state.runRequest"', () => {
    const actual = getters.runRequest(state, '', rootState)
    expect(actual).toEqual('aRunRequest')
  })

  it('"instrumentFlowcellLayout" returns "state.instrumentFlowcellLayout"', () => {
    const actual = getters.instrumentFlowcellLayout(state)
    expect(actual).toEqual(InstrumentFlowcellLayout)
  })
})
