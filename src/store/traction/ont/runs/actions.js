import handlePromise from '@/api/PromiseHelper'
// import * as ONTRun from '@/api/ONTRun'

const setRuns = async ({ commit, getters }) => {
  let request = getters.runRequest
  // let promise = request.get()
  // let response = await handlePromise(promise)
  // if (response.successful && !response.empty) {
  // let runs = response.deserialize.runs

  // mock out data until backend ready
  const runs = [
    {
      id: 1,
      name: 'anothername',
      state: 'started',
      instrument_name: 'MinIon',
      created_at: '12/09/2019 02:22',
    },
    {
      id: 2,
      name: 'anothername1',
      state: 'completed',
      instrument_name: 'MinIon',
      created_at: '10/09/2019 02:22',
    },
    {
      id: 3,
      name: 'anothername2',
      state: 'cancelled',
      instrument_name: 'MinIon',
      created_at: '10/08/2019 02:22',
    },
    {
      id: 4,
      name: 'anothername3',
      state: 'completed',
      instrument_name: 'MinIon',
      created_at: '10/07/2019 02:22',
    },
    {
      id: 5,
      name: 'anothername4',
      state: 'cancelled',
      instrument_name: 'MinIon',
      created_at: '10/01/2019 02:22',
    },
    {
      id: 6,
      name: 'anothername5',
      state: 'completed',
      instrument_name: 'Gridion',
      created_at: '10/02/2022 02:22',
    },
  ]
  commit('setRuns', runs)
  // }
  // return response
}

const newRun = ({ commit, rootGetters }) => {
  // let run = ONTRun.build()
  // // Set default smrt_link_version_id on current run in the state
  // const defaultSmrtLinkVersion = rootGetters['traction/ont/runCreate/defaultSmrtLinkVersion']
  // run.smrt_link_version_id = defaultSmrtLinkVersion.id
  // commit('setCurrentRun', run)
}

const editRun = async ({ commit, getters }, runId) => {
  // let request = getters.runRequest
  // let promise = request.find({ id: runId, include: 'plate.wells.pools.tube' })
  // let response = await handlePromise(promise)
  // if (response.successful) {
  //   const run = response.deserialize.runs[0]
  //   run.wellDefaults = ONTRun.wellDefaults(run.system_name)
  //   run.plate.wells.forEach((well) => {
  //     // Needed for well edit pool barcodes
  //     well.pools.forEach((pool) => (pool.barcode = pool.tube.barcode))
  //   })
  //   // Needed for deleting existing wells
  //   run.plate.wellsToDelete = []
  //   // Set smrt_link_version_id on currenRun in the state
  //   run.smrt_link_version_id = run.pacbio_smrt_link_version_id
  //   commit('setCurrentRun', run)
  // }
}

const createRun = async ({ getters }) => {
  // let run = getters.currentRun
  // let request = getters.ontRequests
  // return await ONTRun.create(run, request)
}

const updateRun = async ({ getters, dispatch }) => {
  // let run = getters.currentRun
  // let originalRun = await dispatch('getRun', run.id)
  // let request = getters.pacbioRequests
  // let responses = await ONTRun.update(run, request)
  // if (responses.length != 0) {
  //   // Rollback - revert run back to original data
  //   await ONTRun.update(originalRun, request)
  // }
  // return responses
}

const getRun = async ({ getters }, id) => {
  // let request = getters.runRequest
  // let promise = request.find({ id, include: 'plate.wells.pools.libraries' })
  // let response = await handlePromise(promise)
  // if (response.successful) {
  //   let run = response.deserialize.runs[0]
  //   return run
  // }
}

const actions = {
  getRun,
  setRuns,
  newRun,
  createRun,
  editRun,
  updateRun,
}

export { getRun, setRuns, newRun, createRun, editRun, updateRun }

export default actions
