import handlePromise from '@/api/PromiseHelper'

const setRuns = async ({ commit, getters }) => {
    let request = getters.runRequest
    let promise = request.get()
    let response = await handlePromise(promise)

    if (response.successful && !response.empty) {
        let runs = response.deserialize.runs
        commit('setRuns', runs)
    }

    return response
}

const startRun = async ({ dispatch }, id) => {
    let payload = { id: id, attributes: { state: 'started' } }
    await dispatch('handleUpdate', payload)
}

const completeRun = async ({ dispatch }, id) => {
    let payload = { id: id, attributes: { state: 'completed' } }
    await dispatch('handleUpdate', payload)
}

const cancelRun = async ({ dispatch }, id) => {
    let payload = { id: id, attributes: { state: 'cancelled' } }
    await dispatch('handleUpdate', payload)
}

const handleUpdate = async ({ getters }, payload) => {
    let request = getters.runRequest
    let runPayload = runPayloadJson(payload)
    let promises = await request.update(runPayload)
    let response = await handlePromise(promises[0])
    return response
}

const runPayloadJson = (payload) => {
    let id = payload.id
    let attributes = payload.attributes

    return {
        data: {
            id: id,
            type: 'runs',
            attributes: attributes
        }
    }
}

const actions = {
    setRuns,
    startRun,
    completeRun,
    cancelRun,
    handleUpdate
}

export {
    setRuns,
    startRun,
    completeRun,
    cancelRun,
    handleUpdate,
    runPayloadJson
}

export default actions