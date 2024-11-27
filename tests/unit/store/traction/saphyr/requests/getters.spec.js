import getters from '@/store/traction/saphyr/requests/getters.js'
import SaphyrRequestFactory from '@tests/factories/SaphyrRequestFactory.js'

const saphyrRequestFactory = SaphyrRequestFactory()

describe('getters', () => {
  it('"requests" returns "state.requests"', () => {
    const state = {
      requests: saphyrRequestFactory.storeData.requests,
    }
    expect(getters.requests(state)).toStrictEqual(
      Object.values(saphyrRequestFactory.storeData.requests),
    )
  })
})
