import { expect, it } from 'vitest'
import Response from '@/api/v1/Response'
import { Data } from '@support/testHelper'
import getters from '@/store/traction/ont/getters'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout'

describe('getters.js', () => {
  let state, instruments, runs

  beforeEach(() => {
    instruments = new Response(Data.OntInstruments).deserialize.instruments
    runs = new Response(Data.OntRuns).deserialize.runs

    state = {
      resources: {
        instruments: instruments,
        runs: runs,
      },
    }
  })

  it('"instruments" returns "state.resources.instruments"', () => {
    const actual = getters.instruments(state)

    const expected = Object.values(state.resources.instruments).map((i) => {
      const instrumentConfig = InstrumentFlowcellLayout[i.instrument_type]
      return {
        ...i,
        ...instrumentConfig,
      }
    })

    expect(actual).toEqual(expected)
  })

  it('"runs" returns "state.resources.runs"', () => {
    const actual = getters.runs(state)

    const expected = Object.values(runs).map((r) => {
      const instrument = Object.values(state.resources.instruments).find(
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
