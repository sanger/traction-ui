import handlePromise  from '@/api/PromiseHelper'
import router         from '@/router'
import * as Run       from '@/api/Run'

const getRuns = async ({ commit, getters }) => {
  let request = getters.runRequest
  let promise = request.get()
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    let runs = response.deserialize.runs
    commit('setRuns', runs)
  }

  return response
}

const startRun = async ({ dispatch }, id)=> {
  let payload = { id: id, attributes: { state: 'started' } }
  await dispatch('handleUpdate', payload)
}

const completeRun = async ({ dispatch }, id)=> {
  let payload = { id: id, attributes: { state: 'completed' } }
  await dispatch('handleUpdate', payload)
}

const cancelRun = async ({ dispatch }, id)=> {
  let payload = { id: id, attributes: { state: 'cancelled' } }
  await dispatch('handleUpdate', payload)
}

const handleUpdate = async ({ getters }, payload) => {
  let request = getters.runRequest
  let runPayload = runPayloadJson(payload)
  let promises = await request.update(runPayload)
  let response = await handlePromise(promises[0])
  return response
}

const runPayloadJson = (payload) => {
  let id = payload.id
  let attributes = payload.attributes

  return {
    data: {
      id: id,
      type: 'runs',
      attributes: attributes
    }
  }
}

const editRun = ({ getters, commit }, runId) => {
  let run = getters.run(runId)
  commit('setCurrentRun', run)
  router.push({ path: `/run/${runId}` })
}

const buildRun = ({ commit }) => {
  let run = Run.build()
  commit('setCurrentRun', run)
  router.push({ path: `/run/${run.id}` })
}

const updateRunName = async ({ dispatch, commit, getters }, attributes)=> {
  let id = attributes.id
  let name = attributes.name

  let isNewRecord = isNaN(id)

  if (isNewRecord) {
    let run = getters.run(id)
    run.name = name
    commit('updateRun', run)
  } else {
    let payload = { id: id, attributes: { name: name } }
    await dispatch('handleUpdate', payload)
  }
}

const updateChipBarcode = async ({ dispatch, commit, getters }, attributes)=> {
  let id = attributes.id
  let barcode = attributes.barcode

  let isNewRecord = isNaN(id)

  if (isNewRecord) {
    let run = getters.run(id)
    Run.updateChipBarcode(run, barcode)
    run.chip.barcode = barcode
    commit('updateRun', run)
  } else {
    let chipPayloadJson = { id: id, attributes: { barcode: barcode } }
    await dispatch('handleChipUpdate', chipPayloadJson)
  }
}

const handleChipUpdate = async ({ getters }, payload) => {
  let request = getters.chipRequest
  let chipPayload = chipPayloadJson(payload)
  let promises = await request.update(chipPayload)
  let response = await handlePromise(promises[0])
  return response
}

const chipPayloadJson = (payload) => {
  let id = payload.id
  let attributes = payload.attributes

  return {
    data: {
      id: id,
      type: 'chips',
      attributes: attributes
    }
  }
}

const actions = {
  getRuns,
  startRun,
  completeRun,
  cancelRun,
  handleUpdate,
  runPayloadJson,
  editRun,
  buildRun,
  updateRunName,
  updateChipBarcode,
  handleChipUpdate,
  chipPayloadJson
}

export {
  getRuns,
  startRun,
  completeRun,
  cancelRun,
  handleUpdate,
  runPayloadJson,
  editRun,
  buildRun,
  updateRunName,
  updateChipBarcode,
  handleChipUpdate,
  chipPayloadJson
}

export default actions
