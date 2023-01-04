import { handleResponse } from '@/api/ResponseHelper'

const findOntPool = async ({ commit, rootState }, filter) => {
  // Here we want to make sure the filter exists
  // If it doesn't exist the request will return all pools
  if (filter['barcode'].trim() === '') {
    return {
      success: false,
      errors: ['Please provide a tube barcode'],
    }
  }

  const request = rootState.api.traction.ont.pools
  const promise = request.get({ filter: filter })
  const response = await handleResponse(promise)
  let { success, data: { data, included = [] } = {}, errors = [] } = response

  // We will be return a successful empty list if no pools match the filter
  // Therefore we want to return an error if we don't have any pools
  if (!data.length) {
    success = false
    errors = [`Unable to find pool with barcode: ${filter['barcode']}`]
  }

  if (success) {
    debugger
    // We want to grab the first (and only) record from the applied filter
    // commit('selectTube', { id: data[0].id, selected: true })
    // commit('populateTubes', data)
  }

  return { success, errors }
}

const actions = {
  findOntPool,
}

export { findOntPool }

export default actions
