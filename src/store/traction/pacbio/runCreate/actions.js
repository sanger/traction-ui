import { handleResponse } from '@/api/ResponseHelper'

export default {
  fetchSmrtLinkVersions: async({commit, rootState}) => {

    const request = rootState.api.traction.pacbio.smrt_link_versions
    const promise = request.get({})
    const response = await handleResponse(promise)

    const { success, data: { data } = {}, errors = [] } = response

    if (success) {
      commit('populateSmrtLinkVersions', data)
    }

    return { success, errors }
  }
}


