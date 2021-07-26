import handlePromise from '@/api/PromiseHelper'

const setPlates = async ({ commit, getters }) => {
  let request = getters.getPlates
  let promise = request.get({ include: 'wells.materials' })
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    let plates = response.deserialize.plates
    commit('setPlates', plates)
  }

  return response
}

const actions = {
  setPlates,
}

export { setPlates }

export default actions
