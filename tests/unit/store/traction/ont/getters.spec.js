import { expect, it } from 'vitest'
import getters from '@/store/traction/ont/getters'
import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout'
import OntInstrumentsFactory from '@tests/factories/OntInstrumentsFactory.js'
import OntRunFactory from '@tests/factories/OntRunFactory.js'

const ontInstrumentsFactory = OntInstrumentsFactory()
const ontRunFactory = OntRunFactory()

describe('getters.js', () => {
  let state, instruments, runs

  beforeEach(() => {
    instruments = ontInstrumentsFactory.storeData.instruments
    runs = ontRunFactory.storeData.runs

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
