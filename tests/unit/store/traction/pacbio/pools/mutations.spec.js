import { Data } from 'testHelper'
import mutations from '@/store/traction/pacbio/pools/mutations'

let state

const { data: pools, included } = Data.TractionPacbioPools.data
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
    expect(state.pools).toEqual({
      '1': { id: '1', libraries: ['1'], tubes: ['1'], type: 'pools' },
      '2': { id: '2', libraries: ['2'], tubes: ['2'], type: 'pools' },
    })
  })

  it('"setTubes" sets "state.tubes" to the given tubes', () => {
    state = {
      tubes: {},
    }
    mutations.setTubes(state, tubes)
    expect(state.tubes).toEqual({
      '1': { barcode: 'TRAC-2-1', id: '1', type: 'tubes' },
      '2': { barcode: 'TRAC-2-2', id: '2', type: 'tubes' },
    })
  })

  it('"setLibraries" sets "state.libraries" to the given libraries', () => {
    state = {
      libraries: {},
    }
    mutations.setLibraries(state, libraries)
    expect(state.libraries).toEqual({
      '1': { id: '1', requests: ['1'], tags: ['26'], type: 'libraries' },
      '2': { id: '2', requests: ['2'], tags: ['7'], type: 'libraries' },
    })
  })

  it('"setTags" sets "state.tags" to the given tags', () => {
    state = {
      tags: {},
    }
    mutations.setTags(state, tags)
    expect(state.tags).toEqual({
      '26': { group_id: 'bc1019', id: '26', type: 'tags' },
      '7': { group_id: 'bc1011_BAK8A_OA', id: '7', type: 'tags' },
    })
  })

  it('"setRequests" sets "state.requests" to the given requests', () => {
    state = {
      requests: {},
    }
    mutations.setRequests(state, requests)
    expect(state.requests).toEqual({
      '1': { id: '1', sample_name: 'Sample48', type: 'requests' },
      '2': { id: '2', sample_name: 'Sample47', type: 'requests' },
    })
  })
})
