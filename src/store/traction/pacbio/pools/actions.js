import handleResponse from '@/api/ResponseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'

const setPools = async ({ commit, getters }, filter) => {
  debugger

  // when users search for nothing, prompt them to enter a barcode
  if (filter['barcode'].trim() === '') {
    return {
      success: false,
      errors: ['Please provide a plate barcode'],
    }
  }

  // separate the barcodes inputted with carriage return
  // const barcodes = filter['barcode'].split('\n').join(',')

  let request = getters.poolRequest
  let promise = request.get({
    include: 'tube,libraries.tag,libraries.request',
    fields: {
      requests: 'sample_name',
      tubes: 'barcode',
      tags: 'group_id',
      libraries: 'request,tag,run_suitability',
    },
    // filter: { barcode: barcodes},
    filter,
  })
  let response = await handleResponse(promise)

  const { success, data: { data, included = [] } = {}, errors = [] } = response

  // success is true with an empty list when no pools match the filter
  if (success && data.length > 0) {
    const { tubes, libraries, tags, requests } = groupIncludedByResource(included)
    commit('setPools', data)
    commit('setTubes', tubes)
    commit('setLibraries', libraries)
    commit('setTags', tags)
    commit('setRequests', requests)
    return { success, errors }
  } else {
    return { success: false, errors: `Unable to find pool with barcode: ${filter['barcode']}` }
  }
}

const actions = { setPools }

export { setPools }

export default actions
