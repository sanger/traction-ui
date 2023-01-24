import { Data } from '@support/testHelper'
import Response from '@/api/Response'
import * as Actions from '@/store/traction/pacbio/plates/actions'

describe('#createPlateInTraction', () => {
  let commit, get, getters, failedResponse, plates

  beforeEach(() => {
    commit = vi.fn()
    get = vi.fn()
    getters = { getPlates: { get: get } }
    plates = new Response(Data.PacbioPlates).deserialize.plates
    failedResponse = {
      data: { data: { errors: { error1: ['There was an error'] } } },
      status: 500,
      statusText: 'Internal Server Error',
    }
  })

  describe('setPlates', () => {
    it('fetches the plates from the service, and commits them', async () => {
      get.mockReturnValue(Data.PacbioPlates)
      const { success, errors } = await Actions.setPlates({ commit, getters })

      expect(commit).toHaveBeenCalledWith('setPlates', plates)
      expect(success).toEqual(true)
      expect(errors).toEqual([])
    })

    it('errors fetching the plates', async () => {
      get.mockRejectedValue({ response: failedResponse })

      const { success, errors } = await Actions.setPlates({ commit, getters })

      expect(commit).not.toHaveBeenCalled()
      expect(success).toEqual(false)
      expect(errors).toEqual({ message: 'error1 There was an error' })
    })
  })
})
