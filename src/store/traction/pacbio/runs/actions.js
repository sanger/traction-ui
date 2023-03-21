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

const actions = {
  fetchPacbioRuns,
}

export { fetchPacbioRuns }

export default actions
