import Response from '@/api/Response'
import { Data } from 'testHelper'
import mutations from '@/store/traction/pacbio/requests/mutations'

let requests

describe('mutations', () => {
  beforeEach(() => {
    requests = new Response(Data.TractionPacbioSamples).deserialize.requests
  })

  it('"setRequests" sets "state.requests" to the given requests', () => {
    const state = {
      requests: [],
    }
    mutations.setRequests(state, requests)
    expect(state.requests).toEqual(requests)
  })
})
