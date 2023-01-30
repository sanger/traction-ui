import { handleResponse } from '@/api/ResponseHelper'

const newRun = ({ commit }) => {
  const run = {
    id: 'new',
    instrument_name: null,
    state: null,
    flowcell_attributes: [],
  }

  commit('setCurrentRun', run)
}

const createRun = async ({ getters, rootGetters }) => {
  const run = getters.currentRun
  const request = getters.runRequest

  const existingInstruments = rootGetters['traction/ont/instruments']
  const instrument_id = existingInstruments.find((i) => i.name == run.instrument_name).id

  const existingPools = rootGetters['traction/ont/pools/pools']

  const flowcell_attributes = run.flowcell_attributes
    .filter((fc) => fc.flowcell_id && fc.tube_barcode)
    .map((fc) => {
      const pool = existingPools.find((p) => p.barcode == fc.tube_barcode)
      const pool_id = pool ? pool.id : ''
      return { ...fc, ...{ ont_pool_id: pool_id } }
    })

  const runPayload = {
    data: {
      type: 'runs',
      attributes: {
        ont_instrument_id: instrument_id,
        state: run.state,
        flowcell_attributes: flowcell_attributes,
      },
    },
  }

  const promise = request.create({ data: runPayload })
  return await handleResponse(promise)
}

const updateRun = async ({ getters, rootGetters }) => {
  const run = getters.currentRun
  const request = getters.runRequest

  const existingInstruments = rootGetters['traction/ont/instruments']
  const instrument_id = existingInstruments.find((i) => i.name == run.instrument_name).id

  const existingPools = rootGetters['traction/ont/pools/pools']

  const flowcell_attributes = run.flowcell_attributes
    .filter((fc) => fc.flowcell_id && fc.tube_barcode)
    .map((fc) => {
      const pool = existingPools.find((p) => p.barcode == fc.tube_barcode)
      const pool_id = pool ? pool.id : ''

      return { ...fc, ...{ ont_pool_id: pool_id } }
    })

  const runPayload = {
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

  const promise = request.update(runPayload)
  return await handleResponse(promise)
}

const editRun = async ({ commit, getters, rootGetters }, runId) => {
  const request = getters.runRequest
  const promise = request.find({ id: runId, include: 'flowcells' })
  const response = await handleResponse(promise)

  const { success, data: { data, included = [] } = {}, errors = [] } = response

  if (success && !data.empty) {
    const existingInstruments = rootGetters['traction/ont/instruments']
    const instrument_name = existingInstruments.find(
      (i) => i.id == data.attributes.ont_instrument_id,
    ).name

    const existingPools = rootGetters['traction/ont/pools/pools']

    const currentRun = {
      id: data.id,
      instrument_name: instrument_name,
      state: data.attributes.state,
      flowcell_attributes: included.map((fc) => {
        const tube_barcode = existingPools.find((p) => p.id == fc.attributes.ont_pool_id).barcode

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
  editRun,
  newRun,
  updateRun,
}

export { createRun, editRun, newRun, updateRun }

export default actions
