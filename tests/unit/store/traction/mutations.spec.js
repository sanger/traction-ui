import Response from '@/api/Response'
import { Data } from '../../testHelper'
import mutations from '@/store/traction/mutations'

let tractionTags

describe('setTags', () => {
  beforeEach(() => {
    tractionTags = new Response(Data.TractionTags).deserialize.tractionTags
  })

  it('"setTags" sets "state.tractionTags" to the given tags', () => {
    const state = {
      tractionTags: [],
    }
    mutations.setTags(state, tractionTags)
    expect(state.tractionTags).toEqual(tractionTags)
  })
})

describe('updateRun', () => {
  let runs, state, updatedRun

  beforeEach(() => {
    runs = new Response(Data.Runs).deserialize.runs

    state = { pacbio: { runs: { runs: runs } } }

    updatedRun = {
      id: '1',
      type: 'runs',
      state: 'started',
      chip_barcode: 'TRAC-123',
      created_at: '03/21/2019 01:01',
    }
  })

  it('updates the given run in the states runs', () => {
    mutations.updateRun(state, updatedRun)
    let recievedRun = state.pacbio.runs.runs.filter((r) => r.id === updatedRun.id)[0]
    expect(recievedRun.state).toEqual(updatedRun.state)
  })
})
