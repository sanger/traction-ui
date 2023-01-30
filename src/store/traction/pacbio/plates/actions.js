import handlePromise from '@/api/PromiseHelper'

const setPlates = async ({ commit, getters }, filter) => {
  const request = getters.getPlates
  const promise = request.get({
    include: 'wells.materials',
    filter,
  })
  const response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    const plates = response.deserialize.plates
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
