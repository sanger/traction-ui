import Response from '@/api/Response'
import { Data } from '@support/testHelper'
import getters from '@/store/traction/ont/runs/getters'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout'

describe('getters', () => {
  let runs, state, instruments, rootState

  beforeEach(() => {
    runs = new Response(Data.OntRuns).deserialize.runs
    instruments = new Response(Data.OntInstruments).deserialize.instruments

    state = {
      runs: runs,
      currentRun: { id: 1 },
      instruments: instruments,
      instrumentFlowcellLayout: InstrumentFlowcellLayout,
    }
    rootState = {
      api: { traction: { ont: { runs: 'aRunRequest', instruments: 'aInstrumentRequest' } } },
    }
  })

  it('"runs" returns "state.runs"', () => {
    const actual = getters.runs(state)
    expect(actual).toEqual(runs)
  })

  it('"run" returns the given run from "state.runs"', () => {
    const actual = getters.run(state)(runs[0].id)
    expect(actual).toEqual(runs[0])
  })

  it('"currentRun" returns "state.currentRun"', () => {
    const actual = getters.currentRun(state)
    expect(actual).toEqual({ id: 1 })
  })

  it('"runRequest" returns "state.runRequest"', () => {
    const actual = getters.runRequest(state, '', rootState)
    expect(actual).toEqual('aRunRequest')
  })

  it('"instrumentRequest" returns "state.instrumentRequest"', () => {
    const actual = getters.instrumentRequest(state, '', rootState)
    expect(actual).toEqual('aInstrumentRequest')
  })

  it('"instrumentFlowcellLayout" returns "state.instrumentFlowcellLayout"', () => {
    const actual = getters.instrumentFlowcellLayout(state)
    expect(actual).toEqual(InstrumentFlowcellLayout)
  })

  it('"instruments" returns "state.instruments"', () => {
    const actual = getters.instruments(state)
    expect(actual).toEqual(instruments)
  })
})
