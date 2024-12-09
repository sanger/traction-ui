import * as Actions from '@/store/traction/pacbio/requests/actions'
import { expect } from 'vitest'
import PacbioSampleFactory from '@tests/factories/PacbioSampleFactory.js'
import { failedResponse } from '@tests/support/testHelper.js'

let requests

const pacbioSampleFactory = PacbioSampleFactory()

describe('actions', () => {
  beforeEach(() => {
    requests = pacbioSampleFactory.content.data.data
  })

  describe('setRequests', () => {
    it('fetches the requets from the service, and commits them', async () => {
      const commit = vi.fn()
      const get = vi.fn()
      const getters = { requestsRequest: { get: get } }
      get.mockReturnValue(pacbioSampleFactory.responses.fetch)

      await Actions.setRequests({ commit, getters })

      expect(commit).toHaveBeenCalledWith('setRequests', pacbioSampleFactory.content.data)
    })
  })

  describe('updateRequest', () => {
    it('successful', async () => {
      const sample = requests[0]
      const update = vi.fn()
      const commit = vi.fn()
      const getters = { requestsRequest: { update: update } }

      update.mockReturnValue(pacbioSampleFactory.responses.fetch)

      const { success, errors } = await Actions.updateRequest({ commit, getters }, sample)
      const expectedPayload = Actions.createRequestPayload(sample)

      expect(getters.requestsRequest.update).toHaveBeenCalledWith(expectedPayload)
      expect(commit).toHaveBeenCalledWith('updateRequest', pacbioSampleFactory.content.data)
      expect(success).toEqual(true)
      expect(errors).toEqual({})
    })

    it('unsuccessful', async () => {
      const sample = requests[0]
      const update = vi.fn()
      const commit = vi.fn()
      const getters = { requestsRequest: { update: update } }
      const mockResponse = failedResponse()

      update.mockRejectedValue(mockResponse)

      const { success } = await Actions.updateRequest({ commit, getters }, sample)

      expect(success).toEqual(false)
    })
  })

  describe('createRequestPayload', () => {
    it('creates the payload for the sample', async () => {
      const sample = pacbioSampleFactory.content.data.data[0]
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
