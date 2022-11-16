import { handleResponse } from '@/api/ResponseHelper'

export default {
  fetchOntRequests: async ({ commit, rootState }, filter = {}) => {
    const request = rootState.api.traction.ont.requests
    const promise = request.get({ filter: filter })
    const response = await handleResponse(promise)

    const { success, data: { data } = {}, errors = [] } = response

    if (success) {
      commit('populateRequests', data)
    }

    return { success, errors }
  },
}
