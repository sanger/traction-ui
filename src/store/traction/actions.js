import handlePromise from '@/api/PromiseHelper'

const getPipeline = () => {
  return localStorage.getItem('pipeline')
}

const startRun = async ({ dispatch }, id) => {
  let payload = { id: id, attributes: { state: 'started' } }
  await dispatch('handleRunUpdate', payload)
}

const completeRun = async ({ dispatch }, id) => {
  let payload = { id: id, attributes: { state: 'completed' } }
  await dispatch('handleRunUpdate', payload)
}

const cancelRun = async ({ dispatch }, id) => {
  let payload = { id: id, attributes: { state: 'cancelled' } }
  await dispatch('handleRunUpdate', payload)
}

const handleRunUpdate = async ({ getters, commit }, payload) => {
  let request = getters[getPipeline() + '/runs/runRequest']
  let runPayload = runPayloadJson(payload)
  const promise = await request.update(runPayload)
  const response = await handlePromise(promise)

  if (response.successful) {
    let updatedRun = response.deserialize.runs[0]
    commit('updateRun', updatedRun)
  }
  return response
}

const runPayloadJson = (payload) => {
  let id = payload.id
  let attributes = payload.attributes

  return {
    data: {
      id: id,
      type: 'runs',
      attributes: attributes,
    },
  }
}

const setTags = async ({ getters, commit }) => {
  let request = getters.tagsRequest
  let promise = request.get()
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    let tags = response.deserialize.tags
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
