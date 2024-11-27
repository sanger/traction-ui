import * as Actions from '@/store/traction/pacbio/plates/actions.js'
import PacbioPlateFactory from '@tests/factories/PacbioPlateFactory.js'
import { failedResponse } from '@tests/support/testHelper.js'

const pacbioPlateFactory = PacbioPlateFactory({ count: 1 })

describe('Pacbio plates actions', () => {
  let commit, get, getters, successResponse

  beforeEach(() => {
    commit = vi.fn()
    get = vi.fn()
    getters = { getPlates: { get: get } }
    successResponse = pacbioPlateFactory.responses.fetch
  })

  describe('setPlates', () => {
    it('fetches the plates from the service, and commits them', async () => {
      get.mockReturnValue(successResponse)
      const { success, errors } = await Actions.setPlates({ commit, getters })

      expect(commit).toHaveBeenCalledWith('setPlates', pacbioPlateFactory.content.data)
      expect(success).toEqual(true)
      expect(errors).toEqual({})
    })

    it('errors fetching the plates', async () => {
      const mockResponse = failedResponse()
      get.mockResolvedValue(mockResponse)

      const { success, errors } = await Actions.setPlates({ commit, getters })

      expect(commit).not.toHaveBeenCalled()
      expect(success).toEqual(false)
      expect(errors).toEqual(mockResponse.errorSummary)
    })
  })

  describe('findPlate', () => {
    it('fetches the plate from the service, and returns it with wells and requests', async () => {
      get.mockReturnValue(successResponse)

      const plate = await Actions.findPlate(
        { commit, getters },
        { barcode: pacbioPlateFactory.storeData.plate.barcode },
      )

      expect(plate).toEqual(pacbioPlateFactory.storeData.plate)
    })

    it('errors fetching the plate', async () => {
      const mockResponse = failedResponse()
      get.mockRejectedValue(mockResponse)

      const plate = await Actions.findPlate({ commit, getters }, { barcode: 'DN814327C' })

      expect(plate).toEqual({})
    })
  })
})
