import handlePromise from '@/api/PromiseHelper'

const setRequests = async ({ commit, getters }) => {
  let request = getters.requestsRequest
  let promise = request.get()
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    let requests = response.deserialize.requests
    commit('setRequests', requests)
  }
}

const actions = {
  setRequests,
}

export { setRequests }

export default actions
