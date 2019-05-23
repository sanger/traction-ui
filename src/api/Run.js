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

const createResource = async (payload, request) => {
  let response = await handlePromise(request.create(payload))
  if (response.successful) {
    return response
  } else {
    throw response.errors
  }
}

const create = async (run, request) => {

  let response, id

  try {
    response = await createResource({ data: { type: "runs", attributes: { name: run.name } } }, request.runs)
    id = response.deserialize.runs[0].id

    response = await createResource({ data: { type: "chips", attributes: { barcode: run.chip.barcode, run_id: id } } }, request.chips)
    id = response.deserialize.chips[0].id

    for (const flowcell of run.chip.flowcells) {
      await createResource({ data: { type: "flowcells", attributes: { position: flowcell.position, library_id: flowcell.library.id, chip_id: id } } }, request.flowcells)
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
  createChip,
  createFlowcell,
  createResource,
  create
}
