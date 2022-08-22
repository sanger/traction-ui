import handlePromise from '@/api/PromiseHelper'
import { handleResponse } from '@/api/ResponseHelper'

const fetchQcAssayTypes = async ({ commit, rootState }) => {
  const request = rootState.api.traction.qc_assay_types
  const promise = request.get()
  const response = await handleResponse(promise)

  const { success, data: { data } = {}, errors = [] } = response

  if (success) {
    commit('populateQcAssayTypes', data)
  }

  return { success, errors }
}

const startRun = async ({ dispatch }, { id, pipeline }) => {
  let payload = { id: id, attributes: { state: 'started' } }
  await dispatch('handleRunUpdate', { payload, pipeline })
}

const completeRun = async ({ dispatch }, { id, pipeline }) => {
  let payload = { id: id, attributes: { state: 'completed' } }
  await dispatch('handleRunUpdate', { payload, pipeline })
}

const cancelRun = async ({ dispatch }, { id, pipeline }) => {
  let payload = { id: id, attributes: { state: 'cancelled' } }
  await dispatch('handleRunUpdate', { payload, pipeline })
}

const handleRunUpdate = async ({ getters, commit }, { payload, pipeline }) => {
  let request = getters[pipeline + '/runs/runRequest']
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
  fetchQcAssayTypes
}

export { startRun, completeRun, cancelRun, handleRunUpdate, runPayloadJson, setTags, fetchQcAssayTypes }

export default actions
