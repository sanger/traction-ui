import handlePromise from '@/api/PromiseHelper'
import { handleResponse } from '@/api/ResponseHelper'
import * as PacbioRun from '@/api/PacbioRun'

const splitPosition = (position) => {
  // match() returns [original, row, column] e.g "A10 => ["A10", "A", "10"]
  return position.match(/(\S)(\d+)/).slice(1)
}

const buildWell = ({ state }, position) => {
  const [row, column] = splitPosition(position)
  return {
    row,
    column,
    position,
    on_plate_loading_concentration: '',
    pools: [],
    ...state.currentRun.wellDefaults,
  }
}

const fetchPacbioRuns = async ({ commit, getters }, filter) => {
  const request = getters.runRequest
  const promise = request.get({ filter })
  const response = await handleResponse(promise)

  const { success, data: { data } = {}, errors = [] } = response

  if (success) {
    commit('setRuns', data)
  }

  return { success, errors }
}

const newRun = ({ commit, rootGetters }) => {
  const run = PacbioRun.build()
  // Set default smrt_link_version_id on current run in the state
  const defaultSmrtLinkVersion = rootGetters['traction/pacbio/runCreate/defaultSmrtLinkVersion']
  run.smrt_link_version_id = defaultSmrtLinkVersion.id
  commit('setCurrentRun', run)
}

const editRun = async ({ commit, getters }, runId) => {
  const request = getters.runRequest
  const promise = request.find({ id: runId, include: 'plate.wells.pools.tube' })
  const response = await handlePromise(promise)

  if (response.successful) {
    const run = response.deserialize.runs[0]
    run.wellDefaults = PacbioRun.wellDefaults(run.system_name)
    run.plate.wells.forEach((well) => {
      // Needed for well edit pool barcodes
      well.pools.forEach((pool) => (pool.barcode = pool.tube.barcode))
    })
    // Needed for deleting existing wells
    run.plate.wellsToDelete = []
    // Set smrt_link_version_id on currentRun in the state
    run.smrt_link_version_id = run.pacbio_smrt_link_version_id
    // Set pools for the selected run
    const pools = run.plate.wells.flatMap((well) => well.pools)

    commit('setCurrentRun', run)
    commit('traction/pacbio/runCreate/setPoolsForExistingRun', pools, { root: true })
  }
}

const createRun = async ({ getters }) => {
  const run = getters.currentRun

  const request = getters.pacbioRequests
  return await PacbioRun.create(run, request)
}

const updateRun = async ({ getters, dispatch }) => {
  const run = getters.currentRun
  const originalRun = await dispatch('getRun', run.id)

  const request = getters.pacbioRequests
  const responses = await PacbioRun.update(run, request)

  if (responses.length != 0) {
    // Rollback - revert run back to original data
    await PacbioRun.update(originalRun, request)
  }
  return responses
}

const getRun = async ({ getters }, id) => {
  const request = getters.runRequest
  const promise = request.find({ id, include: 'plate.wells.pools.libraries' })
  const response = await handlePromise(promise)

  if (response.successful) {
    const run = response.deserialize.runs[0]
    return run
  }
}

const actions = {
  fetchPacbioRuns,
  getRun,
  newRun,
  createRun,
  editRun,
  updateRun,
  buildWell,
}

export { fetchPacbioRuns, newRun, createRun, editRun, updateRun, getRun, buildWell }

export default actions
