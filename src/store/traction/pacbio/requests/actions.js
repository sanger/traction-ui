import handleResponse from '@/api/v1/ResponseHelper'

const setRequests = async ({ commit, getters }, filter, page) => {
  const request = getters.requestsRequest
  const promise = request.get({ page, filter })
  const response = await handleResponse(promise)

  const { success, data: { data, meta = {} } = {}, errors = [] } = response

  if (success) {
    commit('setRequests', data)
  }

  return { success, errors, meta }
}

const updateRequest = async ({ commit, getters }, payload) => {
  const request = getters.requestsRequest
  const requestPayload = createRequestPayload(payload)
  const promise = request.update(requestPayload)
  const response = await handleResponse(promise)

  const { success, data: { data } = {}, errors = [] } = response

  if (success) {
    commit('updateRequest', data)
  }

  return { success, errors }
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
