import * as Actions from '@/store/traction/saphyr/requests/actions'
import SaphyrRequestFactory from '@tests/factories/SaphyrRequestFactory.js'

const saphyrRequestFactory = SaphyrRequestFactory()

describe('actions', () => {
  let successResponse
  beforeEach(() => {
    successResponse = saphyrRequestFactory.responses.fetch
  })

  describe('setRequests', () => {
    it('fetches the requets from the service, and commits them', async () => {
      const commit = vi.fn()
      const get = vi.fn()
      const getters = { requestsRequest: { get: get } }

      get.mockReturnValue(successResponse)

      await Actions.setRequests({ commit, getters })

      expect(commit).toHaveBeenCalledWith('setRequests', saphyrRequestFactory.storeData.requests)
    })
  })
})
