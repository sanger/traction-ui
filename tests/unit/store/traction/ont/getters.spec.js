import { expect, it } from 'vitest'
import getters from '@/store/traction/ont/getters'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout'
import OntInstrumentFactory from '@tests/factories/OntInstrumentFactory.js'
import OntRunsFactory from '@tests/factories/OntRunsFactory.js'

const ontInstrumentFactory = OntInstrumentFactory()
const ontRunsFactory = OntRunsFactory()

describe('getters.js', () => {
  let state, instruments, runs

  beforeEach(() => {
    instruments = ontInstrumentFactory.storeData.instruments
    runs = ontRunsFactory.storeData.runs

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
