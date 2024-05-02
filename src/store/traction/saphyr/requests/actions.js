import handlePromise from '@/api/v1/PromiseHelper'

const setRequests = async ({ commit, getters }) => {
  const request = getters.requestsRequest
  const promise = request.get()
  const response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    const requests = response.deserialize.requests
    commit('setRequests', requests)
  }
}

const actions = {
  setRequests,
}

export { setRequests }

export default actions
