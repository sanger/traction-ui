export default {
  runs: (state) => {
    try {
      return Object.values(state.resources.runs).map((r) => {
        // Is there a way to not do this and just get the instrument id from the run data
        let instrument = Object.values(state.resources.instruments).find(
          (i) => i.id == r.ont_instrument_id,
        )
        return {
          ...r,
          instrument_name: `${instrument.name} (${instrument.instrument_type})`,
        }
      })
    } catch (e) {
      return []
    }
  },
  instruments: (state) => {
    try {
      return Object.values(state.resources.instruments)
    } catch (e) {
      return []
    }
  },
}
