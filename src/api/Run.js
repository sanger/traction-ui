import getTubesForBarcodes from './TubeRequests'
import handlePromise from './PromiseHelper'

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

const createRun = async (run, request) => {
  let name = run.name
  let runJson = { data: { type: "runs", attributes: { name: name } } }
  let promise = request.create(runJson)

  let response = await handlePromise(promise)
  if (response.successful) {
    return response
  } else {
    throw response.errors
  }
}

const createChip = async (chip, runId, request) => {
  let barcode = chip.barcode
  let chipJson = { data: { type: "chips", attributes: { barcode: barcode, run_id: runId } } }
  let promise = request.create(chipJson)

  let response = await handlePromise(promise)
  if (response.successful) {
    return response
  } else {
    throw response.errors
  }
}

const createFlowcell = async (flowcell, chipId, request) => {
  let chipJson = { data: { type: "flowcells", attributes: { position: flowcell.position, library_id: flowcell.library.id, chip_id: chipId } } }
  let promise = request.create(chipJson)

  let response = await handlePromise(promise)
  if (response.successful) {
    return response
  } else {
    throw response.errors
  }
}

const create = async (run, request) => {
  try {
    let runResponse = await createRun(run, request.runs)
    let runId = runResponse.deserialize.runs[0].id

    let chipResponse = await createChip(run.chip, runId, request.chips)
    let chipId = chipResponse.deserialize.chips[0].id

    for (const flowcell of run.chip.flowcells) {
      await createFlowcell(flowcell, chipId, request.flowcells)
    }

  } catch (err) {
    return false
  }
  return true
}

export {
  build,
  validate,
  getLibrary,
  createRun,
  createChip,
  createFlowcell,
  create
}
