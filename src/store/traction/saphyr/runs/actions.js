import handleResponse from '@/api/v2/ResponseHelper.js'
import * as Run from '@/api/v2/SaphyrRun'
import handlePromise from '@/api/v1/PromiseHelper.js'
import { extractAttributes } from '@/api/JsonApi.js'

const setRuns = async ({ commit, getters }) => {
  const request = getters.runRequest
  const promise = request.get({ include: 'chip.flowcells.library' })
  const response = await handleResponse(promise)
  const { success, body: { data, included = [] } = {} } = response
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

//todo - Sabrine to check this after
const getTubeForBarcode = async ({ rootGetters }, barcode) => {
  const request = rootGetters['traction/saphyr/tubes/tubeRequest']
  const promise = request.get({ filter: { barcode }, include: 'materials' })
  const response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    return response.deserialize.tubes[0]
  }
}

const validateLibraryTube = (tube) => {
  if (!tube) {
    return false
  }
  if (!tube.materials) {
    return false
  }
  if (tube.materials[0].material_type != 'library') {
    return false
  }
  return true
}

const editRun = async ({ commit, getters }, runId) => {
  const request = getters.runRequest
  console.log("edit request");
  console.log(request);
  const promise = request.find({ id: runId, include: 'chip.flowcells.library' })
  const response = await handleResponse(promise)
  const { success, body: { data, included = [] } = {} } = response
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

// Sabrine get a new branch and test with it the compete start functinlitye


const updateRun = async ({ getters }) => {
  const run = getters.currentRun
  console.log("update request");
  console.log(run);
  const request = getters.saphyrRequests

  console.log(request);

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
