import { Data } from '../../../../testHelper'
import Response from '@/api/Response'
import * as Actions from '@/store/traction/pacbio/plates/actions'

describe('#createPlateInTraction', () => {
  let commit, get, getters, failedResponse, plates

  beforeEach(() => {
    commit = jest.fn()
    get = jest.fn()
    getters = { getPlates: { get: get } }
    plates = new Response(Data.PacbioPlates).deserialize.plates
    failedResponse = { data: { data: [] }, status: 500, statusText: 'Internal Server Error' }
  })

  describe('setPlates', () => {
    it('fetches the plates from the service, and commits them', async () => {
      get.mockReturnValue(Data.PacbioPlates)
      await Actions.setPlates({ commit, getters })

      expect(commit).toHaveBeenCalledWith('setPlates', plates)
    })

    it('errors fetching the plates', async () => {
      get.mockReturnValue(failedResponse)
      let expectedResponse = new Response(failedResponse)
      let response = await Actions.setPlates({ commit, getters })

      expect(commit).not.toHaveBeenCalled()
      expect(response).toEqual(expectedResponse)
    })
  })
})
