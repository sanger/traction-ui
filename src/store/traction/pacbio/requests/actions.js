import handlePromise from '@/api/PromiseHelper'
import handleResponse from '@/api/ResponseHelper'

const setRequests = async ({ commit, getters }, filter) => {
  const request = getters.requestsRequest
  const promise = request.get({ filter })
  const response = await handleResponse(promise)

  const { success, data: { data } = {}, errors = [] } = response

  if (success) {
    commit('setRequests', data)
  }

  return { success, errors }
}

const updateRequest = async ({ getters }, payload) => {
  const request = getters.requestsRequest
  const sample = getters.requests.find((r) => r.id == payload.id)

  const requestPayload = createRequestPayload(sample)
  const promise = request.update(requestPayload)
  const response = await handlePromise(promise)

  if (response.successful) {
    return response
  } else {
    throw response.errors
  }
}

const createRequestPayload = (sample) => {
  return {
    data: {
      id: sample.id,
      type: 'requests',
      attributes: {
        library_type: sample.library_type,
        estimate_of_gb_required: sample.estimate_of_gb_required,
        number_of_smrt_cells: sample.number_of_smrt_cells,
        cost_code: sample.cost_code,
      },
    },
  }
}

const actions = {
  setRequests,
  updateRequest,
}

export { setRequests, updateRequest, createRequestPayload }

export default actions
