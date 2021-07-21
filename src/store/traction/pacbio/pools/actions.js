import handlePromise from '@/api/PromiseHelper'
import { groupIncludedByResource } from '@/api/JsonApi'

const setPools = async ({ commit, getters }) => {
  let request = getters.poolRequest
  let promise = request.get({
    include: 'tube,libraries.tag,libraries.request',
    fields: {
      requests: 'sample_name',
      tubes: 'barcode',
      tags: 'group_id',
      libraries: 'request,tag',
    },
  })
  let response = await handlePromise(promise)

  const {
    _body: { data, included = [] },
  } = response

  if (response.successful && !response.empty) {
    const { tubes, libraries, tags, requests } = groupIncludedByResource(included)
    commit('setPools', data)
    commit('setTubes', tubes)
    commit('setLibraries', libraries)
    commit('setTags', tags)
    commit('setRequests', requests)
  }
}

const actions = { setPools }

export { setPools }

export default actions
