import mutations from '@/store/traction/saphyr/requests/mutations.js'
import SaphyrRequestsFactory from '@tests/factories/SaphyrRequestsFactory.js'

const saphyrRequestsFactory = SaphyrRequestsFactory()

describe('mutations', () => {
  it('"setRequests" sets "state.requests" to the given requests', () => {
    const state = {
      requests: [],
    }
    mutations.setRequests(state, saphyrRequestsFactory.storeData.requests)
    expect(state.requests).toEqual(saphyrRequestsFactory.storeData.requests)
  })
})
