import handlePromise from '@/api/PromiseHelper'
import * as PacbioRun from '@/api/PacbioRun'

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

const newRun = ({ commit }) => {
    let run = PacbioRun.build()
    commit('setCurrentRun', run)
}

const editRun = async ({ getters, commit }, runId) => {
    let request = getters.runRequest
    let promise = request.find(runId)
    let response = await handlePromise(promise)

    if (response.successful) {
        let run = response.deserialize.runs[0]
        commit('setCurrentRun', run)
    }
}

const createRun = async ({ getters }) => {
    let run = getters.currentRun

    let request = getters.pacbioRequests
    return await PacbioRun.create(run, request)
}

const isLibraryBarcodeValid = async ({ dispatch }, barcode) => {
    if (!barcode) { return false }
    let libraryTube = await dispatch('getTubeForBarcode', barcode)
    return validateLibraryTube(libraryTube)
}

// TODO: Reuse action from tubes module?
const getTubeForBarcode = async ({ rootGetters }, barcode) => {
    let request = rootGetters["traction/pacbio/tubes/tubeRequest"]
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

const updateRun = async ({ getters, dispatch }) => {
    let run = getters.currentRun
    let originalRun = await dispatch('getRun', run.id)

    let request = getters.pacbioRequests
    let responses = await PacbioRun.update(run, request)

    if (responses.length != 0) {
        // Rollback - revert run back to original data
        await PacbioRun.update(originalRun, request)
    }
    return responses
}

const getRun = async ({ getters }, id) => {
    let request = getters.runRequest
    let promise = request.find(id)
    let response = await handlePromise(promise)

    if (response.successful) {
        let run = response.deserialize.runs[0]
        return run
    }
}

const actions = {
    getRun,
    setRuns,
    newRun,
    createRun,
    isLibraryBarcodeValid,
    getTubeForBarcode,
    editRun,
    updateRun,
}

export {
    setRuns,
    newRun,
    createRun,
    isLibraryBarcodeValid,
    getTubeForBarcode,
    validateLibraryTube,
    editRun,
    updateRun,
    getRun,
}

export default actions