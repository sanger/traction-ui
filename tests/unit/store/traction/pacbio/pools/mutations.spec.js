import { Data } from '@support/testHelper'
import mutations from '@/store/traction/pacbio/pools/mutations'

let state
const storePools = Data.StorePoolsV1
const { data: pools, included } = Data.TractionPacbioPoolsV1.data
const tubes = included.slice(0, 2)
const libraries = included.slice(2, 4)
const tags = included.slice(4, 6)
const requests = included.slice(6, 8)

describe('mutations', () => {
  it('"setPools" sets "state.pools" to the given pools', () => {
    state = {
      pools: {},
    }
    mutations.setPools(state, pools)
    expect(state.pools).toEqual(storePools.pools)
  })

  it('"setTubes" sets "state.tubes" to the given tubes', () => {
    state = {
      tubes: {},
    }
    mutations.setTubes(state, tubes)
    expect(state.tubes).toEqual(storePools.tubes)
  })

  it('"setLibraries" sets "state.libraries" to the given libraries', () => {
    state = {
      libraries: {},
    }
    mutations.setLibraries(state, libraries)
    expect(state.libraries).toEqual(storePools.libraries)
  })

  it('"setTags" sets "state.tags" to the given tags', () => {
    state = {
      tags: {},
    }
    mutations.setTags(state, tags)
    expect(state.tags).toEqual(storePools.tags)
  })

  it('"setRequests" sets "state.requests" to the given requests', () => {
    state = {
      requests: {},
    }
    mutations.setRequests(state, requests)
    expect(state.requests).toEqual(storePools.requests)
  })
})
