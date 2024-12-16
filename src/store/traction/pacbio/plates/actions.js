import handleResponse from '@/api/ResponseHelper'
import { extractPlatefromData } from '@/stores/utilities/plate.js'

const setPlates = async ({ commit, getters }, options) => {
  const request = getters.getPlates
  const promise = request.get({ ...options })
  const response = await handleResponse(promise)

  const {
    body: { data = {}, meta = {} },
    success,
    errors = {},
  } = response
  if (success) {
    commit('setPlates', data)
  }

  return { success, errors, meta }
}

const findPlate = async ({ getters }, filter) => {
  const request = getters.getPlates
  const promise = request.get({ filter, include: 'wells.requests' })
  const response = await handleResponse(promise)
  const {
    success,
    body: { data, included = [] },
  } = response

  if (success) {
    return extractPlatefromData({ data, included })
  }

  return {}
}

const actions = {
  setPlates,
  findPlate,
}

export { setPlates, findPlate }

export default actions
