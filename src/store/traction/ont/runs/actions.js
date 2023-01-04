// import handlePromise from '@/api/PromiseHelper'
import * as OntRun from '@/api/OntRun'

// const setRuns = async ({ commit, getters }) => {
const setRuns = async ({ commit }) => {
  // let request = getters.runRequest
  // let promise = request.get()
  // let response = await handlePromise(promise)
  // if (response.successful && !response.empty) {
  // let runs = response.deserialize.runs

  // Mock-out data until backend service ready
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

const newRun = ({ commit }) => {
  let run = OntRun.build()
  commit('setCurrentRun', run)
}

const createRun = async ({ getters }) => {
  let run = getters.currentRun

  let request = getters.runRequest
  return await OntRun.create(run, request)
}

const actions = {
  setRuns,
  newRun,
  createRun,
}

export { setRuns, newRun, createRun }

export default actions
