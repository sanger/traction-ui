import { dataToObjectById } from '@/api/JsonApi.js'
import handleResponse from '@/api/ResponseHelper.js'

const setRequests = async ({ commit, getters }) => {
  const request = getters.requestsRequest
  const promise = request.get()
  const response = await handleResponse(promise)
  const {
    body: { data = {} },
    success,
  } = response

  if (success) {
    const requests = dataToObjectById({ data, includeRelationships: true })
    commit('setRequests', requests)
  }
}

const actions = {
  setRequests,
}

export { setRequests }

export default actions
