import handlePromise from '@/api/PromiseHelper'
import * as PacbioRun from '@/api/PacbioRun'

const setRuns = async ({ commit, getters }) => {
  let request = getters.runRequest
  let promise = request.get({ include: 'plate.wells.pools.tube' })
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    let runs = response.deserialize.runs
    commit('setRuns', runs)
  }

  return response
}

const newRun = ({ commit }) => {
  let run = PacbioRun.build()
  commit('setCurrentRun', run)
}

const editRun = async ({ commit, getters }, runId) => {
  let request = getters.runRequest
  let promise = request.find(runId, { include: 'plate.wells.pools.tube' })
  let response = await handlePromise(promise)

  if (response.successful) {
    const run = response.deserialize.runs[0]
    run.plate.wells.forEach((well) => {
      // Needed for well edit pool barcodes
      well.pools.forEach((pool) => (pool.barcode = pool.tube.barcode))
    })
    commit('setCurrentRun', run)
  }
}

const createRun = async ({ getters }) => {
  let run = getters.currentRun

  let request = getters.pacbioRequests
  return await PacbioRun.create(run, request)
}

const updateRun = async ({ getters, dispatch }) => {
  let run = getters.currentRun
  let originalRun = await dispatch('getRun', run.id)

  let request = getters.pacbioRequests
  let responses = await PacbioRun.update(run, request)

  if (responses.length != 0) {
    // Rollback - revert run back to original data
    await PacbioRun.update(originalRun, request)
  }
  return responses
}

const getRun = async ({ getters }, id) => {
  let request = getters.runRequest
  let promise = request.find({ id, include: 'plate.wells.libraries' })
  let response = await handlePromise(promise)

  if (response.successful) {
    let run = response.deserialize.runs[0]
    return run
  }
}

const actions = {
  getRun,
  setRuns,
  newRun,
  createRun,
  editRun,
  updateRun,
}

export { setRuns, newRun, createRun, editRun, updateRun, getRun }

export default actions
