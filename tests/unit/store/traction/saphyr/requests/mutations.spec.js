import mutations from '@/store/traction/saphyr/requests/mutations.js'
import SaphyrRequestFactory from '@tests/factories/SaphyrRequestFactory.js'

const saphyrRequestFactory = SaphyrRequestFactory()

describe('mutations', () => {
  it('"setRequests" sets "state.requests" to the given requests', () => {
    const state = {
      requests: [],
    }
    mutations.setRequests(state, saphyrRequestFactory.storeData.requests)
    expect(state.requests).toEqual(saphyrRequestFactory.storeData.requests)
  })
})
