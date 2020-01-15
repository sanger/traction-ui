import handlePromise from '@/api/PromiseHelper'
import router from '@/router'
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