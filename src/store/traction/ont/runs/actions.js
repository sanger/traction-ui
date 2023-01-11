import { handleResponse } from '@/api/ResponseHelper'
import * as OntRun from '@/api/OntRun'

const setRuns = async ({ commit, getters }) => {
  let request = getters.runRequest
  let promise = request.get({ include: 'instrument' })
  const response = await handleResponse(promise)
  const { success, data: { data, included = [] } = {}, errors = [] } = response
  if (success && !data.empty) {
    let runs = data.map((r) => {
      let instrument = included.find((i) => i.id == r.attributes.ont_instrument_id).attributes

      return {
        ...r.attributes,
        id: r.id,
        instrument_name: `${instrument.name} (${instrument.instrument_type})`,
      }
    })
    commit('setRuns', runs)
  }
  return errors
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

const setInstruments = async ({ commit, getters }) => {
  let request = getters.instrumentRequest
  let promise = request.get()
  const response = await handleResponse(promise)
  const { success, data: { data, included = [] } = {}, errors = [] } = response

  if (success && !data.empty) {
    let instruments = data.map((i) => i.attributes)
    commit('setInstruments', instruments)
  }
  return errors
}

const actions = {
  setRuns,
  newRun,
  createRun,
  setInstruments,
}

export { setRuns, newRun, createRun, setInstruments }

export default actions
