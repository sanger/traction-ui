import { dataToObjectById } from '@/api/JsonApi'

const mutations = {
  setPools(state, pools) {
    state.pools = dataToObjectById({ data: pools, includeRelationships: true })
  },
  setTubes(state, tubes) {
    state.tubes = dataToObjectById({ data: tubes, includeRelationships: false })
  },
  setLibraries(state, libraries) {
    state.libraries = dataToObjectById({ data: libraries, includeRelationships: true })
  },
  setTags(state, tags) {
    state.tags = dataToObjectById({ data: tags, includeRelationships: false })
  },
  setRequests(state, requests) {
    state.requests = dataToObjectById({ data: requests, includeRelationships: false })
  },
}

export default mutations
