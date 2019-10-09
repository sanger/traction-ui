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

const generateSampleSheet = async (id) => {
    console.log(id)
    console.log("generateSampleSheet")
}

const actions = {
    setRuns,
    generateSampleSheet
}

export {
    setRuns,
    generateSampleSheet
}

export default actions