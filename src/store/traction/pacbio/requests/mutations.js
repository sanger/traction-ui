import { dataToObjectById, extractAttributes } from '@/api/JsonApi'
import Vue from 'vue'

const mutations = {
  setRequests(state, requests) {
    state.requests = dataToObjectById({ data: requests, includeRelationships: false })
  },
  updateRequest(state, request) {
    Vue.set(state.requests, request.id, extractAttributes(request))
  },
}

export default mutations
