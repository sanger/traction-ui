import Response from '@/api/v1/Response'
import * as Actions from '@/store/traction/saphyr/requests/actions'
import { Data } from '@support/testHelper'

let requests

describe('actions', () => {
  beforeEach(() => {
    requests = new Response(Data.TractionSaphyrRequests).deserialize.requests
  })

  describe('setRequests', () => {
    it('fetches the requets from the service, and commits them', async () => {
      const commit = vi.fn()
      const get = vi.fn()
      const getters = { requestsRequest: { get: get } }

      get.mockReturnValue(Data.TractionSaphyrRequests)

      await Actions.setRequests({ commit, getters })

      expect(commit).toHaveBeenCalledWith('setRequests', requests)
    })
  })
})
