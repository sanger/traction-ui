import handlePromise from '@/api/PromiseHelper'
import router from '@/router'
import Response from '@/api/Response'

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

const editRun = ({ getters, commit }, runId) => {
    let run = getters.run(runId)
    commit('setCurrentRun', run)
    router.push({ path: `/saphyr/run/${runId}` })
}

const updateRunName = async ({ getters, commit, dispatch }, name) => {
    commit('updateRunName', name)
    let run = getters.currentRun

    if (isExistingRecord(run)) {
        let payload = { id: run.id, attributes: { name: name } }
        let response = await dispatch('handleUpdate', payload)
        return response
    }
}

const updateChipBarcode = async ({ commit, getters }, barcode) => {
    commit('updateChipBarcode', barcode)
    let run = getters.currentRun

    if (isExistingRecord(run)) {
        let chip = run.chip
        let request = getters.chipRequest

        let payload = {
            data: {
                id: chip.id,
                type: 'chips',
                attributes: {
                    barcode: chip.barcode
                }
            }
        }

        let promise = request.update(payload)
        return await handlePromise(promise[0])
    }
}

const updateLibraryBarcode = async ({ commit, getters, dispatch }, payload) => {   
    let barcode = payload.barcode
    let index = payload.flowcellIndex

    // Get the new material for the given barcode
    let libraryTube = await dispatch('getTubeForBarcode', barcode)

    // Check the material is a library
    let isValid = validateLibraryTube(libraryTube)

    if (isValid) {
        let library = libraryTube.material
        let updatedPayload = { flowcellIndex: index, library: library}

        // Update the library state of the current run
        commit('updateLibrary', updatedPayload)
    } else {
        let failedResponse = { data: { errors: { library: ['is not valid'] } }, status: 422 }
        return new Response(failedResponse)
    }

    let run = getters.currentRun
    if (isExistingRecord(run)) {
        // Request to update flowcell with new library
        let flowcell = run.chip.flowcells[index]
        let library = flowcell.library

        let request = getters.flowcellRequest

        let requestData = {
            data: {
                id: flowcell.id,
                type: 'flowcells',
                attributes: {
                    saphyr_library_id: library.id
                }
            }
        }

        let promise = request.update(requestData)
        return await handlePromise(promise[0])
    }
}

// Reuse action from tubes module?
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

const isExistingRecord = (run) => {
    return !isNaN(run.id)
}

const actions = {
    setRuns,
    startRun,
    completeRun,
    cancelRun,
    handleUpdate,
    editRun,
    updateRunName,
    updateChipBarcode,
    updateLibraryBarcode,
    getTubeForBarcode
}

export {
    setRuns,
    startRun,
    completeRun,
    cancelRun,
    handleUpdate,
    runPayloadJson,
    editRun,
    updateRunName,
    updateChipBarcode,
    updateLibraryBarcode,
    getTubeForBarcode
}

export default actions