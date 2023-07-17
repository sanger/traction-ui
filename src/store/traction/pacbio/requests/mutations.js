import { dataToObjectById, extractAttributes } from '@/api/JsonApi'

const mutations = {
  setRequests(state, requests) {
    state.requests = dataToObjectById({ data: requests, includeRelationships: false })
  },
  updateRequest(state, request) {
    state.requests[request.id] = extractAttributes(request)
  },
}

export default mutations
