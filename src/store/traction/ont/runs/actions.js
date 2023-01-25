import { handleResponse } from '@/api/ResponseHelper'

const newRun = ({ commit }) => {
  let run = {
    id: 'new',
    instrument_name: null,
    state: null,
    flowcell_attributes: [],
  }

  commit('setCurrentRun', run)
}

const createRun = async ({ getters, rootGetters }) => {
  let run = getters.currentRun
  let request = getters.runRequest

  let instrument_id = getters.instruments.find((i) => i.name == run.instrument_name).id

  let existingPools = rootGetters['traction/ont/pools/pools']

  let flowcell_attributes = run.flowcell_attributes
    .filter((fc) => fc.flowcell_id && fc.tube_barcode)
    .map((fc) => {
      let pool = existingPools.find((p) => p.barcode == fc.tube_barcode)
      let pool_id = pool ? pool.id : ''
      return { ...fc, ...{ ont_pool_id: pool_id } }
    })

  let runPayload = {
    data: {
      type: 'runs',
      attributes: {
        ont_instrument_id: instrument_id,
        state: run.state,
        flowcell_attributes: flowcell_attributes,
      },
    },
  }

  let promise = request.create({ data: runPayload })
  return await handleResponse(promise)
}

const updateRun = async ({ getters, rootGetters }) => {
  let run = getters.currentRun
  let request = getters.runRequest
  let instrument_id = getters.instruments.find((i) => i.name == run.instrument_name).id

  let existingPools = rootGetters['traction/ont/pools/pools']

  let flowcell_attributes = run.flowcell_attributes
    .filter((fc) => fc.flowcell_id && fc.tube_barcode)
    .map((fc) => {
      let pool = existingPools.find((p) => p.barcode == fc.tube_barcode)
      let pool_id = pool ? pool.id : ''

      return { ...fc, ...{ ont_pool_id: pool_id } }
    })

  let runPayload = {
    data: {
      type: 'runs',
      id: run.id,
      attributes: {
        ont_instrument_id: instrument_id,
        state: run.state,
        flowcell_attributes: flowcell_attributes,
      },
    },
  }

  let promise = request.update(runPayload)
  return await handleResponse(promise)
}

const setInstruments = async ({ commit, getters }) => {
  let request = getters.instrumentRequest
  let promise = request.get()
  const response = await handleResponse(promise)
  const { success, data: { data } = {}, errors = [] } = response

  if (success && !data.empty) {
    let instruments = data.map((i) => {
      return {
        ...i.attributes,
        id: i.id,
      }
    })

    commit('setInstruments', instruments)
  }
  return errors
}

const editRun = async ({ commit, getters, rootGetters }, runId) => {
  let request = getters.runRequest
  let promise = request.find({ id: runId, include: 'flowcells' })
  let response = await handleResponse(promise)

  const { success, data: { data, included = [] } = {}, errors = [] } = response

  if (success && !data.empty) {
    let instrument_name = getters.instruments.find(
      (i) => i.id == data.attributes.ont_instrument_id,
    ).name

    let existingPools = rootGetters['traction/ont/pools/pools']

    let currentRun = {
      id: data.id,
      instrument_name: instrument_name,
      state: data.attributes.state,
      flowcell_attributes: included.map((fc) => {
        let tube_barcode = existingPools.find((p) => p.id == fc.attributes.ont_pool_id).barcode

        return {
          flowcell_id: fc.attributes.flowcell_id,
          ont_pool_id: fc.attributes.ont_pool_id,
          position: fc.attributes.position,
          tube_barcode: tube_barcode,
        }
      }),
    }

    commit('setCurrentRun', currentRun)

    return { success, errors }
  }
}

const actions = {
  createRun,
  setInstruments,
  editRun,
  newRun,
  updateRun,
}

export { createRun, setInstruments, editRun, newRun, updateRun }

export default actions
