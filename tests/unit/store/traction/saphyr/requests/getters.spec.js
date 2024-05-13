import Response from '@/api/v1/Response'
import { Data } from '@support/testHelper'
import getters from '@/store/traction/saphyr/requests/getters'

let requests

describe('getters', () => {
  beforeEach(() => {
    requests = new Response(Data.TractionSaphyrRequests).deserialize.requests
  })

  it('"requests" returns "state.requests"', () => {
    const state = {
      requests: requests,
    }
    expect(getters.requests(state)).toBe(requests)
  })
})
