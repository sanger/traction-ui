import handlePromise from '@/api/PromiseHelper'
import * as PacbioRun from '@/api/PacbioRun'
const pre_extension_time = 2
const ccs_analysis_output = 'Yes'
const loading_target_p1_plus_p2_default = 0.85

const generateHiFiDefault = (systemName) => {
  switch (systemName) {
    case 'Sequel I':
    case 'Sequel II':
      return 'In SMRT Link'
    case 'Sequel IIe':
      return 'On Instrument'
    default:
      return ''
  }
}

const splitPosition = (position) => {
  // match() returns [original, row, column] e.g "A10 => ["A10", "A", "10"]
  return position.match(/(\S)(\d+)/).slice(1)
}

const buildWell = ({ state }, position) => {
  let generate_hifi = generateHiFiDefault(state.currentRun.system_name)
  let binding_kit_box_barcode = state.currentRun.default_binding_kit_box_barcode || ''
  let [row, column] = splitPosition(position)
  const loading_target_p1_plus_p2 =
    state.currentRun.loading_target_p1_plus_p2 || loading_target_p1_plus_p2_default
  return {
    row,
    column,
    movie_time: '',
    position,
    on_plate_loading_concentration: '',
    generate_hifi,
    ccs_analysis_output,
    binding_kit_box_barcode,
    pools: [],
    pre_extension_time,
    loading_target_p1_plus_p2,
  }
}

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
  let promise = request.find({ id: runId, include: 'plate.wells.pools.tube' })
  let response = await handlePromise(promise)

  if (response.successful) {
    const run = response.deserialize.runs[0]
    run.plate.wells.forEach((well) => {
      // Needed for well edit pool barcodes
      well.pools.forEach((pool) => (pool.barcode = pool.tube.barcode))
    })
    // Needed for deleting existing wells
    run.plate.wellsToDelete = []
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

const actions = {
  getRun,
  setRuns,
  newRun,
  createRun,
  editRun,
  updateRun,
  buildWell,
}

export { setRuns, newRun, createRun, editRun, updateRun, getRun, buildWell }

export default actions
