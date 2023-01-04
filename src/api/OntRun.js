const build = (object) => {
  return (
    object || {
      id: 'new',
      instrument_name: '',
      current_state: '',
    }
  )
}

export { build }
