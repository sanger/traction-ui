import * as Actions from '@/store/traction/pacbio/requests/actions'
import { expect } from 'vitest'
import { newResponse } from '@/api/v1/ResponseHelper'
import PacbioSamplesFactory from '@tests/factories/PacbioSamplesFactory.js'

let requests

const tractionPacbioSamplesFactory = PacbioSamplesFactory()

describe('actions', () => {
  beforeEach(() => {
    requests = tractionPacbioSamplesFactory.content.data.data
  })

  describe('setRequests', () => {
    it('fetches the requets from the service, and commits them', async () => {
      const commit = vi.fn()
      const get = vi.fn()
      const getters = { requestsRequest: { get: get } }
      get.mockReturnValue(tractionPacbioSamplesFactory.responses.fetch)

      await Actions.setRequests({ commit, getters })

      expect(commit).toHaveBeenCalledWith('setRequests', tractionPacbioSamplesFactory.content.data)
    })
  })

  describe('updateRequest', () => {
    it('successful', async () => {
      const sample = requests[0]
      const update = vi.fn()
      const commit = vi.fn()
      const getters = { requestsRequest: { update: update } }

      update.mockReturnValue(tractionPacbioSamplesFactory.responses.fetch)

      const { success, errors } = await Actions.updateRequest({ commit, getters }, sample)
      const expectedPayload = Actions.createRequestPayload(sample)

      expect(getters.requestsRequest.update).toHaveBeenCalledWith(expectedPayload)
      expect(commit).toHaveBeenCalledWith(
        'updateRequest',
        tractionPacbioSamplesFactory.content.data,
      )
      expect(success).toEqual(true)
      expect(errors).toEqual({})
    })

    it('unsuccessful', async () => {
      const sample = requests[0]
      const update = vi.fn()
      const commit = vi.fn()
      const getters = { requestsRequest: { update: update } }
      const mockResponse = {
        error: ['There was an error'],
        status: 500,
        ok: false,
      }

      update.mockRejectedValue({ ...mockResponse })
      const expectedResponse = newResponse({ ...mockResponse, success: false })

      const { success, errors } = await Actions.updateRequest({ commit, getters }, sample)

      expect(success).toEqual(false)
      expect(errors.error).toEqual(expectedResponse.errors)
    })
  })

  describe('createRequestPayload', () => {
    it('creates the payload for the sample', async () => {
      const sample = tractionPacbioSamplesFactory.content.data.data[0]
      const result = Actions.createRequestPayload(sample)

      expect(result.data.id).toEqual(sample.id)
      expect(result.data.type).toEqual('requests')
      expect(result.data.attributes.library_type).toEqual(sample.library_type)
      expect(result.data.attributes.estimate_of_gb_required).toEqual(sample.estimate_of_gb_required)
      expect(result.data.attributes.number_of_smrt_cells).toEqual(sample.number_of_smrt_cells)
      expect(result.data.attributes.cost_code).toEqual(sample.cost_code)
    })
  })
})
