import Response from '@/api/v1/Response'
import { Data } from '@support/testHelper'
import mutations from '@/store/traction/saphyr/requests/mutations'

let requests

describe('mutations', () => {
  beforeEach(() => {
    requests = new Response(Data.TractionSaphyrRequests).deserialize.requests
  })

  it('"setRequests" sets "state.requests" to the given requests', () => {
    const state = {
      requests: [],
    }
    mutations.setRequests(state, requests)
    expect(state.requests).toEqual(requests)
  })
})
