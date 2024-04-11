import InstrumentFlowcellLayout from '@/config/InstrumentFlowcellLayout'

export default {
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
  instrumentByName:
    (state, { instruments }) =>
    (name) => {
      return instruments.find((i) => i.name == name)
    },
}
