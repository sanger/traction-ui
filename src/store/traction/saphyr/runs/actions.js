import handlePromise from '@/api/v1/PromiseHelper'
import * as Run from '@/api/v1/SaphyrRun'

const setRuns = async ({ commit, getters }) => {
  const request = getters.runRequest
  const promise = request.get({ include: 'chip.flowcells.library' })
  const response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    const runs = response.deserialize.runs
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
  const promise = request.find({ id: runId, include: 'chip.flowcells.library' })
  const response = await handlePromise(promise)

  if (response.successful) {
    const run = response.deserialize.runs[0]
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
