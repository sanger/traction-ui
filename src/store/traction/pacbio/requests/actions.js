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

const updateRequest = async ({ getters }, id) => {
    let request = getters.requestsRequest
    let sample = getters.requests.filter(r => r.id == id)[0]

    let requestPayload = createRequestPayload(sample)
    let promises = request.update(requestPayload)
    let response = await handlePromise(promises[0])

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
            type: "requests",
            attributes: {
                library_type: sample.library_type,
                estimate_of_gb_required: sample.estimate_of_gb_required,
                number_of_smrt_cells: sample.number_of_smrt_cells,
                cost_code: sample.cost_code,
                external_study_id: sample.external_study_id,
            }
        }
    }
}

const actions = {
    setRequests,
    updateRequest
}

export {
    setRequests,
    updateRequest,
    createRequestPayload
}

export default actions