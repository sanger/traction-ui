import handlePromise from '@/api/PromiseHelper'

const startRun = async ({ dispatch }, { id, pipeline }) => {
  const payload = { id: id, attributes: { state: 'started' } }
  await dispatch('handleRunUpdate', { payload, pipeline })
}

const completeRun = async ({ dispatch }, { id, pipeline }) => {
  const payload = { id: id, attributes: { state: 'completed' } }
  await dispatch('handleRunUpdate', { payload, pipeline })
}

const cancelRun = async ({ dispatch }, { id, pipeline }) => {
  const payload = { id: id, attributes: { state: 'cancelled' } }
  await dispatch('handleRunUpdate', { payload, pipeline })
}

const handleRunUpdate = async ({ getters, commit }, { payload, pipeline }) => {
  const request = getters[pipeline + '/runs/runRequest']
  const runPayload = runPayloadJson(payload)
  const promise = await request.update(runPayload)
  const response = await handlePromise(promise)

  if (response.successful) {
    const updatedRun = response.deserialize.runs[0]
    commit('updateRun', updatedRun)
  }
  return response
}

const runPayloadJson = (payload) => {
  const id = payload.id
  const attributes = payload.attributes

  return {
    data: {
      id: id,
      type: 'runs',
      attributes: attributes,
    },
  }
}

const setTags = async ({ getters, commit }) => {
  const request = getters.tagsRequest
  const promise = request.get()
  const response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    const tags = response.deserialize.tags
    commit('setTags', tags)
  }
  return response
}

const actions = {
  startRun,
  completeRun,
  cancelRun,
  handleRunUpdate,
  setTags,
}

export { startRun, completeRun, cancelRun, handleRunUpdate, runPayloadJson, setTags }

export default actions
