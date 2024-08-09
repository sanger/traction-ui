import getters from '@/store/traction/saphyr/requests/getters.js'
import SaphyrRequestsFactory from '@tests/factories/SaphyrRequestsFactory.js'

const saphyrRequestsFactory = SaphyrRequestsFactory()

describe('getters', () => {
  it('"requests" returns "state.requests"', () => {
    const state = {
      requests: saphyrRequestsFactory.storeData.requests,
    }
    expect(getters.requests(state)).toStrictEqual(
      Object.values(saphyrRequestsFactory.storeData.requests),
    )
  })
})
