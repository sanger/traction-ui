import handlePromise from '@/api/v1/PromiseHelper'

const setTags = async ({ getters, commit }) => {
  const request = getters.tagsRequest
  const promise = request.get()
  const response = await handlePromise(promise)

  if (response.successful && !response.empty) {
    const tags = response.deserialize.tags
    commit('setTags', tags)
  }
  return response
}

const actions = {
  setTags,
}

export { setTags }

export default actions
