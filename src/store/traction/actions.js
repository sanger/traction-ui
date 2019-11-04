import handlePromise from '@/api/PromiseHelper'

const startRun = async ({ dispatch }, id) => {
    let payload = { id: id, attributes: { state: 'started' } }
    await dispatch('handleRunUpdate', payload)
}

const completeRun = async ({ dispatch }, id) => {
    let payload = { id: id, attributes: { state: 'completed' } }
    await dispatch('handleRunUpdate', payload)
}

const cancelRun = async ({ dispatch }, id) => {
    let payload = { id: id, attributes: { state: 'cancelled' } }
    await dispatch('handleRunUpdate', payload)
}

const handleRunUpdate = async ({ rootGetters, getters }, payload) => {
    let request = getters[rootGetters.pipeline + "/runs/runRequest"]

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
    startRun,
    completeRun,
    cancelRun,
    handleRunUpdate,
}

export {
    startRun,
    completeRun,
    cancelRun,
    handleRunUpdate,
    runPayloadJson
}

export default actions