import handlePromise from '@/api/PromiseHelper'

const setPlates = async ({ commit, getters }, filter) => {
  let request = getters.getPlates
  let promise = request.get({
    include: 'wells.materials',
    filter: filter,
  })
  let response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    let plates = response.deserialize.plates
    commit('setPlates', plates)
    return { success: true, errors: [] }
  }

  return { success: false, errors: response.errors }
}

const actions = {
  setPlates,
}

export { setPlates }

export default actions
