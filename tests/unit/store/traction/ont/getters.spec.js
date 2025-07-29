import { expect, it } from 'vitest'
import getters from '@/store/traction/ont/getters'
import OntRunFactory from '@tests/factories/OntRunFactory.js'
import OntInstrumentFactory from '@tests/factories/OntInstrumentFactory.js'

const ontRunFactory = OntRunFactory()
const ontInstrumentFactory = OntInstrumentFactory()

describe('getters.js', () => {
  let state, runs

  beforeEach(() => {
    runs = ontRunFactory.storeData.runs

    state = {
      resources: {
        runs: runs,
        instruments: ontInstrumentFactory.storeData.instruments,
      },
    }
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
