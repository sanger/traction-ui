import { handleResponse } from '@/api/ResponseHelper'

export default {
  fetchOntRequests: async ({ commit, rootState }) => {
    const request = rootState.api.traction.ont.requests
    const promise = request.get()
    const response = await handleResponse(promise)

    const { success, data: { data } = {}, errors = [] } = response

    if (success) {
      commit('populateRequests', data)
    }

    return { success, errors }
  },
}
