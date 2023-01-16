import { handleResponse } from '@/api/ResponseHelper'

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
  let run = {
    id: 'new',
    instrument_name: '',
    state: '',
    flowcell_attributes: [],
  }

  commit('setCurrentRun', run)
}

const createRun = async ({ getters }) => {
  let run = getters.currentRun
  let request = getters.runRequest

  let instrument_id = getters.instruments.find((i) => i.name == run.instrument_name).id

  let flowcell_attributes = run.flowcell_attributes
    .filter((fc) => fc.flowcell_id && fc.ont_pool_kit_barcode)
    .map((fc) => {
      let pool_id = getters.pools.find((p) => p.kit_barcode == fc.ont_pool_kit_barcode).id
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

/**
 * Retrieves a list of ont pools from traction-service and populates the source
 * with associated data, appending data to the previously stored state
 * @param rootState the vuex rootState object. Provides access to the current state
 * @param commit the vuex commit object. Provides access to mutations
 */
// For the component, the included relationships are not required
// However, the functionality does not appear to work without them
const populateOntPools = async ({ commit, rootState }) => {
  const request = rootState.api.traction.ont.pools
  const promise = request.get()
  const response = await handleResponse(promise)

  let { success, data: { data } = {}, errors = [] } = response

  if (success && !data.empty) {
    let pools = data.map((p) => {
      return {
        ...p.attributes,
        id: p.id,
      }
    })

    commit('populatePools', pools)
  }

  return { success, errors }
}

const editRun = async ({ commit, getters }, runId) => {
  let request = getters.runRequest
  let promise = request.find({ id: runId, include: 'flowcells' })
  let response = await handleResponse(promise)

  const { success, data: { data, included = [] } = {}, errors = [] } = response

  if (success && !data.empty) {
    let instrument_name = getters.instruments.find(
      (i) => i.id == data.attributes.ont_instrument_id,
    ).name

    let currentRun = {
      id: data.id,
      instrument_name: instrument_name,
      state: data.attributes.state,
      flowcell_attributes: included.map((fc) => {
        let ont_pool_kit_barcode = getters.pools.find(
          (p) => p.id == fc.attributes.ont_pool_id,
        ).kit_barcode

        return {
          flowcell_id: fc.attributes.flowcell_id,
          ont_pool_id: fc.attributes.ont_pool_id,
          position: fc.attributes.position,
          ont_pool_kit_barcode: ont_pool_kit_barcode,
        }
      }),
    }

    commit('setCurrentRun', currentRun)

    return { success, errors }
  }
}

const actions = {
  setRuns,
  createRun,
  setInstruments,
  populateOntPools,
  editRun,
  newRun,
}

export { setRuns, createRun, setInstruments, populateOntPools, editRun, newRun }

export default actions
