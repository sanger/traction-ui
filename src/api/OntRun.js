import handlePromise from './PromiseHelper'

// Move to state
const build = (object) => {
  return (
    object || {
      id: 'new',
      instrument_name: '',
      state: '',
      flowcell_attributes: [],
    }
  )
}

const create = async (run, request) => {
  try {
    let runPayload = createRunPayload(run)
    await createResource(runPayload, request)
  } catch (err) {
    return err.message
  }
  // What to return?
  return []
}

const createRunPayload = (run) => {
  return {
    data: {
      type: 'runs',
      attributes: {
        ont_instrument_id: 1, // this will be the instrument id
        state: run.state,
        flowcell_attributes: flowcellsPayload(run.flowcell_attributes),
      },
    },
  }
}

const flowcellsPayload = (flowcells) => {
  return flowcells.filter((fc) => fc.flowcell_id && fc.ont_pool_id)
}

const createResource = async (payload, request) => {
  let response = await handlePromise(request.create({ data: payload }))
  if (response.successful) {
    return response
  } else {
    // Check errors object is present
    throw response.errors
  }
}

export { build, create, createResource, createRunPayload }
