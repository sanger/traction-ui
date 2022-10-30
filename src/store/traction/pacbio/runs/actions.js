import handlePromise from '@/api/PromiseHelper'
import * as PacbioRun from '@/api/PacbioRun'

import handleResponse from '@/api/ResponseHelper'

const splitPosition = (position) => {
  // match() returns [original, row, column] e.g "A10 => ["A10", "A", "10"]
  return position.match(/(\S)(\d+)/).slice(1)
}

const buildWell = ({ state }, position) => {
  let [row, column] = splitPosition(position)
  return {
    row,
    column,
    position,
    on_plate_loading_concentration: '',
    pools: [],
    ...state.currentRun.wellDefaults,
  }
}

const setRuns = async ({ commit, getters }) => {
  let request = getters.runRequest
  let promise = request.get()
  let response = await handleResponse(promise)

  const { success, data: { data } = {}, errors = [] } = response

  if (success) {
    commit('setRuns', data)
  }

  return { success, errors }
}

const newRun = ({ commit, getters }) => {
  let run = PacbioRun.build()
  // Set default smrt_link_version_id on current run in the state
  const defaultSmrtLinkVersion = getters.defaultSmrtLinkVersion
  run.smrt_link_version_id = defaultSmrtLinkVersion.id
  commit('setCurrentRun', run)
}

const editRun = async ({ commit, getters }, runId) => {
  let request = getters.runRequest
  let promise = request.find({ id: runId, include: 'plate.wells.pools.tube' })
  let response = await handlePromise(promise)

  if (response.successful) {
    const run = response.deserialize.runs[0]
    run.wellDefaults = PacbioRun.wellDefaults(run.system_name)
    run.plate.wells.forEach((well) => {
      // Needed for well edit pool barcodes
      well.pools.forEach((pool) => (pool.barcode = pool.tube.barcode))
    })
    // Needed for deleting existing wells
    run.plate.wellsToDelete = []
    // Set smrt_link_version_id on currenRun in the state
    run.smrt_link_version_id = run.pacbio_smrt_link_version_id
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
  let promise = request.find({ id, include: 'plate.wells.pools.libraries' })
  let response = await handlePromise(promise)

  if (response.successful) {
    let run = response.deserialize.runs[0]
    return run
  }
}

/**
 * Retrieves a list of pacbio smrt_link_versions and populates the store.
 * @param rootState the vuex rootState object. Provides access to current state
 * @param commit the vuex commit object. Provides access to mutations
 */
const fetchSmrtLinkVersions = async ({ commit, rootState }) => {
  const request = rootState.api.traction.pacbio.smrt_link_versions
  const promise = request.get({})
  const response = await handleResponse(promise)

  const { success, data: { data } = {}, errors = [] } = response

  if (success) {
    commit('populateSmrtLinkVersions', data)
  }
  return { success, errors }
}

const actions = {
  getRun,
  setRuns,
  newRun,
  createRun,
  editRun,
  updateRun,
  buildWell,
  fetchSmrtLinkVersions,
}

export { setRuns, newRun, createRun, editRun, updateRun, getRun, buildWell, fetchSmrtLinkVersions }

export default actions
