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

const actions = {
    setRuns,
    newRun
}

export {
    setRuns,
    newRun
}

export default actions