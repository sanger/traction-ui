import getTubesForBarcodes from './TubeRequests'

const build = () => {
  return {
    chip: {
      flowcells: [
        { position: 1, library: {} },
        { position: 2, library: {} }
      ]     
    }
  }
}

const getLibrary = async (barcode, request) => {
  let response = await getTubesForBarcodes(barcode, request)
  if (response.successful && !response.empty) {
    let material = response.deserialize.tubes[0].material
    if (material.type === 'libraries') { return material }
  }
  return
}

const validate = async (run, request) => {
  let errors = {}
  if (run.chip.barcode === undefined) {
    errors['chip'] = 'barcode not present'
  }
  if (run.chip.barcode && run.chip.barcode.length < 16) {
    errors['chip'] = 'barcode not in correct format'
  }
  for (const flowcell of run.chip.flowcells) {
    if (flowcell.library.barcode === undefined) {
      if (errors['flowcells'] === undefined) { errors['flowcells'] = {} }
      errors.flowcells[flowcell.position] = 'library not present'
    }
    else {
      let library = await getLibrary(flowcell.library.barcode, request)
      if (library === undefined) {
        if (errors['flowcells'] === undefined) { errors['flowcells'] = {} }
        errors.flowcells[flowcell.position] = 'library does not exist'
      }
    }
  }
  return errors
}

export {
  build,
  validate,
  getLibrary
}