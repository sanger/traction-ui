const build = () => {
  return {
    chip: {
      flowcells: [
        { position: 1 },
        { position: 2 }
      ]     
    }
  }
}

const validate = (run) => {
  let errors = {}
  if (run.chip.barcode === undefined) {
    errors['chip'] = 'barcode not present'
  }
  if (run.chip.barcode && run.chip.barcode.length < 16) {
    errors['chip'] = 'barcode not in correct format'
  }
  return errors
}

export {
  build,
  validate
}