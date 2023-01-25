import { Data } from '@support/testHelper'
import mutations from '@/store/traction/pacbio/requests/mutations'
import { dataToObjectById } from '@/api/JsonApi'

describe('mutations', () => {
  it('"setRequests" sets "state.requests" to the given requests', () => {
    const requests = Data.PacbioRequestsRequest.data.data
    const state = {
      requests: {},
    }
    mutations.setRequests(state, requests)
    expect(state.requests).toEqual(
      dataToObjectById({ data: requests, includeRelationships: false }),
    )
  })
})
