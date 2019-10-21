import handlePromise from '@/api/PromiseHelper'
import * as PacbioRun from '@/api/PacbioRun'
import router from '@/router'

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
    router.push({ path: `/pacbio/run/new` })
}

const createRun = async ({ getters }) => {
    let run = getters.currentRun

    // let mockRun = {
    //     id: 'new',
    //     name: 'a run name',
    //     template_prep_kit_box_barcode: 'dsadas',
    //     binding_kit_box_barcode: 'dsada',
    //     sequencing_kit_box_barcode: 'dsada',
    //     dna_control_complex_box_barcode: 'dsada',
    //     comments: 'adsdsa',
    //     system_name: 'Sequel II',
    //     plate: {
    //         barcode: 'dsfsdfds',
    //         // create wells in seperate function
    //         wells: [
    //             { row: 'A', column: '1', movie_time: '1', insert_size: '11', on_plate_loading_concentration: 'x', sequencing_mode: 'CCS', library: { id: '15' } },
    //             { row: 'A', column: '2', movie_time: '1', insert_size: '11', on_plate_loading_concentration: 'x', sequencing_mode: 'CCS', library: { id: '15' } },
    //         ]
    //     }
    // }

    let request = getters.pacbioRequests
    return await PacbioRun.create(run, request)
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
    newRun,
    createRun,
    startRun,
    completeRun,
    cancelRun,
    handleUpdate,
}

export {
    setRuns,
    newRun,
    createRun,
    startRun,
    completeRun,
    cancelRun,
    handleUpdate,
    runPayloadJson
}

export default actions