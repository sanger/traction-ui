import handlePromise from '@/api/PromiseHelper'
import * as Run from '@/api/SaphyrRun'

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
    if (!tube.materials) { return false }
    if (tube.materials[0].material_type != 'library') { return false }
    return true
}

const editRun = async ({ commit, getters }, runId) => {
    let request = getters.runRequest
    let promise = request.find(runId)
    let response = await handlePromise(promise)
    
    if (response.successful) {
        let run = response.deserialize.runs[0]
        commit('setCurrentRun', run)
    }
}

const newRun = ({ commit }) => {
    let run = Run.build()
    commit('setCurrentRun', run)
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
    isLibraryBarcodeValid,
    getTubeForBarcode,
    editRun,
    newRun,
    createRun,
    updateRun
}

export {
    setRuns,
    isLibraryBarcodeValid,
    getTubeForBarcode,
    editRun,
    newRun,
    createRun,
    updateRun,
    validateLibraryTube
}

export default actions