import Response from '@/api/Response'
import { Data } from '@support/testHelper'
import getters from '@/store/traction/ont/runs/getters'

describe('getters', () => {
  let runs, state, instruments

  beforeEach(() => {
    runs = new Response(Data.OntRuns).deserialize.runs
    instruments = new Response(Data.OntInstruments).deserialize.instruments

    state = {
      runs: runs,
      currentRun: { id: 1 },
      instruments: instruments,
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

  it('"instruments" returns "state.instruments"', () => {
    const actual = getters.instruments(state)
    expect(actual).toEqual(instruments)
  })
})
