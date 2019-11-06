import Response from '@/api/Response'
import * as Actions from '@/store/traction/pacbio/requests/actions'
import { Data } from '../../../../testHelper'

let requests, failedResponse

describe('actions', () => {
  beforeEach(() => {
    requests = new Response(Data.TractionPacbioSamples).deserialize.requests
    failedResponse = { status: 404, statusText: 'Record not found', data: { errors: { title: ['The record could not be found.'] } } }
  })

  describe("setRequests", () => {
    it("fetches the requets from the service, and commits them", async () => {
      const commit = jest.fn()
      const get = jest.fn()
      const getters = { 'requestsRequest': { 'get': get } }

      get.mockReturnValue(Data.TractionPacbioSamples)

      await Actions.setRequests({ commit, getters })

      expect(commit).toHaveBeenCalledWith("setRequests", requests)
    })
  })

  describe("updateRequest", () => {
    it("successful", async () => {
      let sample = requests[0]
      const update = jest.fn()
      const getters = { 'requestsRequest': { 'update': update }, 'requests': requests }

      update.mockReturnValue([Data.TractionPacbioSamples])

      let resp = await Actions.updateRequest({ getters }, sample.id)

      let expectedPayload = Actions.createRequestPayload(sample)
      expect(getters.requestsRequest.update).toHaveBeenCalledWith(expectedPayload)

      let expectedResp = new Response(Data.TractionPacbioSamples)
      expect(resp).toEqual(expectedResp)
    })

    it("unsuccessful", async () => {
      let sample = requests[0]
      const update = jest.fn()
      const getters = { 'requestsRequest': { 'update': update }, 'requests': requests }

      update.mockReturnValue([failedResponse])

      let expectedResponse = new Response(failedResponse)
      await expect(Actions.updateRequest({ getters }, sample.id)).rejects.toEqual(expectedResponse.errors)

    })
  })
})
