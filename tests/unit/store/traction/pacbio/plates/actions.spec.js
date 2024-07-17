import * as Actions from '@/store/traction/pacbio/plates/actions'
import PacbioPlatesRequestFactory from '@tests/factories/PacbioPlatesRequestFactory'

const pacbioPlatesRequestFactory = PacbioPlatesRequestFactory()

describe('Pacbio plates actions', () => {
  let commit, get, getters, failedResponse, successResponse

  beforeEach(() => {
    commit = vi.fn()
    get = vi.fn()
    getters = { getPlates: { get: get } }

    failedResponse = {
      error1: ['There was an error'],
      status: 500,
      ok: false,
    }
    successResponse = pacbioPlatesRequestFactory.responses.fetch
  })

  describe('setPlates', () => {
    it('fetches the plates from the service, and commits them', async () => {
      get.mockReturnValue(successResponse)
      const { success, errors } = await Actions.setPlates({ commit, getters })

      expect(commit).toHaveBeenCalledWith('setPlates', pacbioPlatesRequestFactory.content.data)
      expect(success).toEqual(true)
      expect(errors).toEqual({})
    })

    it('errors fetching the plates', async () => {
      get.mockRejectedValue(failedResponse)

      const { success, errors } = await Actions.setPlates({ commit, getters })

      expect(commit).not.toHaveBeenCalled()
      expect(success).toEqual(false)
      expect(errors.error1).toEqual(['There was an error'])
    })
  })

  describe('findPlate', () => {
    it('fetches the plate from the service, and returns it with wells and requests', async () => {
      get.mockReturnValue(successResponse)

      // Barcode provided is first plate in Data.PacbioPlatesRequest
      const plate = await Actions.findPlate({ commit, getters }, { barcode: 'DN814327C' })

      expect(plate).toEqual(pacbioPlatesRequestFactory.expectedPlates)
    })

    it('errors fetching the plate', async () => {
      get.mockRejectedValue(failedResponse)

      // Barcode provided is first plate in Data.PacbioPlatesRequest
      const plate = await Actions.findPlate({ commit, getters }, { barcode: 'DN814327C' })

      expect(plate).toEqual({})
    })
  })
})
