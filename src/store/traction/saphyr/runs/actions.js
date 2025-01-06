import handleResponse from '@/api/ResponseHelper.js'
import * as Run from '@/api/SaphyrRun'
import { dataToObjectById, extractAttributes } from '@/api/JsonApi.js'

const setRuns = async ({ commit, getters }) => {
  const request = getters.runRequest
  const promise = request.get({ include: 'chip.flowcells.library' })
  const response = await handleResponse(promise)
  const { success, body: { data = [] } = {} } = response
  if (success && !response.empty) {
    const runs = data.map((run) => {
      return extractAttributes(run)
    })
    commit('setRuns', runs)
  }
  return response
}

const isLibraryBarcodeValid = async ({ dispatch }, barcode) => {
  if (!barcode) {
    return false
  }
  const libraryTube = await dispatch('getTubeForBarcode', barcode)
  return validateLibraryTube(libraryTube)
}

const getTubeForBarcode = async ({ rootGetters }, barcode) => {
  const request = rootGetters['traction/saphyr/tubes/tubeRequest']
  const promise = request.get({ filter: { barcode }, include: 'materials' })
  const response = await handleResponse(promise)
  const { success, body: { included = [] } = {} } = response
  if (success && !included.empty) {
    return Object.values(dataToObjectById({ data: response.body.data.included }))[0]
  }
}

const validateLibraryTube = (tube) => {
  if (!tube) {
    return false
  }
  if (tube.material_type !== 'library') {
    return false
  }
  return true
}

const editRun = async ({ commit, getters }, runId) => {
  const request = getters.runRequest
  const promise = request.find({ id: runId, include: 'chip.flowcells.library' })
  const response = await handleResponse(promise)
  const { success, body: { data } = {} } = response
  if (success) {
    const run = extractAttributes(data)
    commit('setCurrentRun', run)
  }
}

const newRun = ({ commit }) => {
  const run = Run.build()
  commit('setCurrentRun', run)
}

const createRun = async ({ getters }) => {
  const run = getters.currentRun
  const request = getters.saphyrRequests
  return await Run.create(run, request)
}

const updateRun = async ({ getters }) => {
  const run = getters.currentRun
  const request = getters.saphyrRequests
  return await Run.update(run, request)
}

const actions = {
  setRuns,
  isLibraryBarcodeValid,
  getTubeForBarcode,
  editRun,
  newRun,
  createRun,
  updateRun,
}

export {
  setRuns,
  isLibraryBarcodeValid,
  getTubeForBarcode,
  editRun,
  newRun,
  createRun,
  updateRun,
  validateLibraryTube,
}

export default actions
