import handlePromise from './PromiseHelper'

const isObject = (item) => {
  return item !== undefined && item instanceof Object
}

const assign = (object, other) => {
  const otherKey = Object.keys(other)[0]
  return Object.keys(object).reduce((result, key) => {
    if (key === otherKey) {
      if (isObject(object[key]) && isObject(other[otherKey])) {
        result[key] = { ...object[key], ...other[otherKey] }
      } else {
        result[key] = other[otherKey]
      }
    } else if (isObject(object[key])) {
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
        { position: 1, library: { barcode: '' } },
        { position: 2, library: { barcode: '' } },
      ],
    },
  }
  run.assign = (object) => {
    assign(this, object)
  }
  return run
}

const create = async (run, request) => {
  let id
  let responses = []

  try {
    let runPayload = { data: { type: 'runs', attributes: { name: run.name } } }
    let runResponse = await createResource(runPayload, request.runs)
    id = runResponse.deserialize.runs[0].id
    responses.push(runResponse)

    let chipPayload = {
      data: { type: 'chips', attributes: { barcode: run.chip.barcode, saphyr_run_id: id } },
    }
    let chipResponse = await createResource(chipPayload, request.chips)
    id = chipResponse.deserialize.chips[0].id
    responses.push(chipResponse)

    for (const flowcell of run.chip.flowcells) {
      let flowcellPayload = {
        data: {
          type: 'flowcells',
          attributes: {
            position: flowcell.position,
            saphyr_library_id: flowcell.library.id,
            saphyr_chip_id: id,
          },
        },
      }
      let flowcellResponse = await createResource(flowcellPayload, request.flowcells)
      responses.push(flowcellResponse)
    }
  } catch (err) {
    rollback(responses, request)
    return false
  }
  return true
}

const createResource = async (payload, request) => {
  let response = await handlePromise(request.create(payload))

  if (response.successful) {
    return response
  } else {
    throw response.errors
  }
}

const update = async (run, request) => {
  let responses = []

  try {
    let runPayload = { data: { id: run.id, type: 'runs', attributes: { name: run.name } } }
    let runResponse = await updateResource(runPayload, request.runs)
    responses.push(runResponse)

    let chipPayload = {
      data: { id: run.chip.id, type: 'chips', attributes: { barcode: run.chip.barcode } },
    }
    let chipResponse = await updateResource(chipPayload, request.chips)
    responses.push(chipResponse)

    for (const flowcell of run.chip.flowcells) {
      let flowcellPayload = {
        data: {
          id: flowcell.id,
          type: 'flowcells',
          attributes: { saphyr_library_id: flowcell.library.id },
        },
      }
      let flowcellResponse = await updateResource(flowcellPayload, request.flowcells)
      responses.push(flowcellResponse)
    }
  } catch (err) {
    rollback(responses, request)
    return false
  }
  return true
}

const updateResource = async (payload, request) => {
  let promises = await request.update(payload)
  let response = await handlePromise(promises[0])

  if (response.successful) {
    return response
  } else {
    throw response.errors
  }
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

export { build, createResource, create, update, rollback, destroy, assign, updateResource }
