import { handleResponse } from '@/api/ResponseHelper'
import { dataToObjectById } from '@/api/JsonApi'

const fetchPacbioRuns = async ({ commit, getters }, filter) => {
  const request = getters.runRequest
  const promise = request.get({ filter, include: 'plates' })
  const response = await handleResponse(promise)

  const { success, data: { data, included = [] } = {}, errors = [] } = response

  const platesById = dataToObjectById({ data: included })

  if (success) {
    // Concatenate SKBB info for a run
    data.map((run) => {
      const runPlateIds = run.relationships.plates.data.map((p) => p.id)
      const sequencing_kit_box_barcodes = runPlateIds.map((plateId) => {
        const plate = platesById[plateId]
        return `Plate ${plate.plate_number}: ${plate.sequencing_kit_box_barcode}`
      })
      run.attributes.sequencing_kit_box_barcodes = sequencing_kit_box_barcodes
    })
    commit('setRuns', data)
  }

  return { success, errors }
}

/**
 * Updates an existing run
 * @param rootState the vuex rootState object. Provides access to current state
 * @returns { success, errors }. Was the request successful? were there any errors?
 */
const updateRun = async ({ rootState, commit }, { id, ...attributes }) => {
  const request = rootState.api.traction.pacbio.runs
  const payload = {
    data: {
      id: id,
      type: 'runs',
      attributes: { ...attributes },
    },
  }
  const promise = request.update(payload)
  const response = await handleResponse(promise)

  const { success, data: { data } = {}, errors = [] } = response

  if (success) {
    // This updates the store to reflect the state change
    commit('updateRun', data)
  }

  return { success, errors }
}

const actions = {
  fetchPacbioRuns,
  updateRun,
}

export { fetchPacbioRuns, updateRun }

export default actions
