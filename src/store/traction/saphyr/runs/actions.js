import handlePromise from '@/api/PromiseHelper'
import router from '@/router'
import * as Run from '@/api/Run'

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

// TODO: turn these methods into one
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

const isLibraryBarcodeValid = async ({ dispatch }, barcode) => {
    if (!barcode) { return false }
    let libraryTube = await dispatch('getTubeForBarcode', barcode)
    return validateLibraryTube(libraryTube)
}

// TODO: Reuse action from tubes module?
const getTubeForBarcode = async ({ rootGetters }, barcode) => {
    let request = rootGetters["traction/saphyr/tubes/tubeRequest"]
    let promise = request.get({ filter: { barcode: barcode } })
    let response = await handlePromise(promise)

    if (response.successful && !response.empty) {
        return response.deserialize.tubes[0]
    }
}

const validateLibraryTube = (tube) => {
    if (!tube) { return false }
    if (!tube.material) { return false }
    if (tube.material.type != 'libraries') { return false }
    return true
}

const editRun = ({ getters, commit }, runId) => {
    let run = getters.run(runId)
    commit('setCurrentRun', run)
    router.push({ path: `/saphyr/run/${runId}` })
}

const newRun = ({ commit }) => {
    let run = Run.build()
    commit('setCurrentRun', run)
    router.push({ path: `/saphyr/run/new` })
}

const createRun = async ({ getters }) => {
    let run = getters.currentRun
    let request = getters.saphyrRequests

    return await Run.create(run, request)
}

const updateRun = async ({ getters }) => {
    let run = getters.currentRun
    let request = getters.saphyrRequests

    return await Run.update(run, request)
}

const actions = {
    setRuns,
    startRun,
    completeRun,
    cancelRun,
    handleUpdate,
    isLibraryBarcodeValid,
    getTubeForBarcode,
    editRun,
    newRun,
    createRun,
    updateRun
}

export {
    setRuns,
    startRun,
    completeRun,
    cancelRun,
    handleUpdate,
    runPayloadJson,
    isLibraryBarcodeValid,
    getTubeForBarcode,
    editRun,
    newRun,
    createRun,
    updateRun,
    validateLibraryTube
}

export default actions