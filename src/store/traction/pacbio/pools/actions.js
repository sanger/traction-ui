import handleResponse from '@/api/ResponseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'

const setPools = async ({ commit, getters }, filter) => {
  const request = getters.poolRequest
  const promise = request.get({
    include: 'tube,libraries.tag,libraries.request',
    fields: {
      requests: 'sample_name',
      tubes: 'barcode',
      tags: 'group_id',
      libraries: 'request,tag,run_suitability',
    },
    filter,
  })
  const response = await handleResponse(promise)

  const { success, data: { data, included = [] } = {}, errors = [] } = response

  if (success) {
    const { tubes, libraries, tags, requests } = groupIncludedByResource(included)
    commit('setPools', data)
    commit('setTubes', tubes)
    commit('setLibraries', libraries)
    commit('setTags', tags)
    commit('setRequests', requests)
  }

  return { success, errors }
}

const actions = { setPools }

export { setPools }

export default actions
