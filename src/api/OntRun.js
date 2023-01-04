import handlePromise from './PromiseHelper'

const build = (object) => {
  return (
    object || {
      id: 'new',
      instrument_name: '',
      state: '',
    }
  )
}

const create = async (run, request) => {
  // let runId
  // let responses = []

  try {
    let runPayload = createRunPayload(run)
    await createResource(runPayload, request)
    // runId = runResponse.deserialize.runs[0].id
    // responses.push(runResponse)
  } catch (err) {
    // How does this work?
    // destroy(runId, request.runs)
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
        flowcell_attributes: [],
      },
    },
  }
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
