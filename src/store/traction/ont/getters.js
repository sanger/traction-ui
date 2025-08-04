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
}
