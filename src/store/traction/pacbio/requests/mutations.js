import { dataToObjectById } from '@/api/JsonApi'

const mutations = {
  setRequests(state, requests) {
    state.requests = dataToObjectById({ data: requests, includeRelationships: false })
  },
}

export default mutations
