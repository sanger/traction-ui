import handleResponse from '@/api/ResponseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'

const setPools = async ({ commit, getters }, filter, page) => {
  const request = getters.poolRequest
  const promise = request.get({
    page,
    filter,
    include: 'tube,libraries.tag,libraries.request',
    fields: {
      requests: 'sample_name',
      tubes: 'barcode',
      tags: 'group_id',
      libraries: 'request,tag,run_suitability',
    },
  })
  const response = await handleResponse(promise)

  const { success, data: { data, included = [], meta = {} } = {}, errors = [] } = response

  if (success) {
    const { tubes, library_pools, tags, requests } = groupIncludedByResource(included)
    commit('setPools', data)
    commit('setTubes', tubes)
    commit('setLibraries', library_pools)
    commit('setTags', tags)
    commit('setRequests', requests)
  }

  return { success, errors, meta }
}

const actions = { setPools }

export { setPools }

export default actions
