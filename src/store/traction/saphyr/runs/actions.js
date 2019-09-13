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
        let isValid = validateChip(chip)
        
        let response
        if (isValid) {
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
            response = await handlePromise(promise[0])
        } else {
            let mockResponse = { data: { errors: { chip: ['is not in a valid format'] } }, status: 422 }
            response = new Response(mockResponse)
        }
        return response
    }
}

const validateChip = (chip) => {
    return chip.barcode && chip.barcode.length >= 16
}

const updateLibraryBarcode = async ({ commit }, payload) => {
    commit('updateLibraryBarcode', payload)
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
    validateChip,
    updateLibraryBarcode
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
    validateChip,
    updateLibraryBarcode
}

export default actions