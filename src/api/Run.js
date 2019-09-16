import handlePromise from './PromiseHelper'

const isObject = (item) => {
  return (item !== undefined && item instanceof Object)
}

const assign = (object, other) => {
  const otherKey = Object.keys(other)[0]
  return Object.keys(object).reduce((result, key) => {
    if (key === otherKey) {
      if (isObject(object[key]) && isObject(other[otherKey])) {
        result[key] = {...object[key], ...other[otherKey]}
      } else {
        result[key] = other[otherKey]
      }
    }
    else if (isObject(object[key])) {
      result[key] = assign(object[key], other)
    } else {
      result[key] = object[key]
    }
    return result
  }, {})
}

const build = (object) => {
  let run = object || {
    id: 'new',
    name: '',
    chip: {
      barcode: '',
      flowcells: [
        { position: 1, library: { barcode: ''} },
        { position: 2, library: { barcode: ''} }
      ]
    }
  }
  run.assign = (object) => { assign(this, object) }
  return run
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

  let id
  let responses = []

  try {
    let runResponse = await createResource({ data: { type: "runs", attributes: { name: run.name } } }, request.runs)
    id = runResponse.deserialize.runs[0].id
    responses.push(runResponse)

    let chipResponse = await createResource({ data: { type: "chips", attributes: { barcode: run.chip.barcode, saphyr_run_id: id } } }, request.chips)
    id = chipResponse.deserialize.chips[0].id
    responses.push(chipResponse)

    for (const flowcell of run.chip.flowcells) {
      let flowcellResponse = await createResource({ data: { type: "flowcells", attributes: { position: flowcell.position, saphyr_library_id: flowcell.library.id, saphyr_chip_id: id } } }, request.flowcells)
      responses.push(flowcellResponse)
    }

  } catch (err) {
    rollback(responses, request)
    return false
  }
  return true
}

const rollback = (responses, request) => {
  for (const response of responses) {
    let deserializedResponse = response.deserialize
    let type = Object.keys(deserializedResponse)[0]
    let id = deserializedResponse[type][0].id
    destroy(id, request[type])
  }

  return true
}

const destroy = async (id, request) => {
  let promise = request.destroy(id)

  return await handlePromise(promise)
}

export {
  build,
  createResource,
  create,
  rollback,
  destroy,
  assign
}
