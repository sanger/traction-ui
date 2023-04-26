import { handleResponse } from '@/api/ResponseHelper'

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
