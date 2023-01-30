import Response from '@/api/Response'
import * as Actions from '@/store/traction/saphyr/requests/actions'
import { Data } from '@support/testHelper'
import { newResponse } from '@/api/ResponseHelper'
import deserialize from '@/api/JsonApi'

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

  describe('#exportSampleExtractionTubesIntoTraction', () => {
    let dispatch, create, getters, tubes

    beforeEach(() => {
      create = vi.fn()
      getters = { requestsRequest: { create: create } }

      const expectedResponse = newResponse({
        ...Data.SampleExtractionTubesWithSample,
        success: true,
      })

      tubes = deserialize(expectedResponse.data).assets
    })

    it('successfully', async () => {
      const expectedResponse = newResponse({
        success: true,
        ...Data.TractionSaphyrTubesWithRequest,
      })

      create.mockReturnValue(Data.TractionSaphyrTubesWithRequest)

      const response = await Actions.exportSampleExtractionTubesIntoTraction({ getters }, tubes)

      const expectedPayload = {
        data: {
          data: {
            type: 'requests',
            attributes: {
              requests: Actions.sampleExtractionTubeJson(tubes),
            },
          },
        },
      }
      expect(create).toBeCalledWith(expectedPayload)
      expect(response).toEqual(expectedResponse)
    })

    it('unsuccessfully', async () => {
      const failedResponse = {
        success: false,
        status: 422,
        statusText: 'Unprocessable Entity',
        data: { errors: { name: ['error message'] } },
      }

      const expectedResponse = newResponse({
        success: false,
        ...failedResponse,
      })

      create.mockReturnValue(failedResponse)

      const response = await Actions.exportSampleExtractionTubesIntoTraction(
        { dispatch, getters },
        tubes,
      )

      expect(response).toEqual(expectedResponse)
    })
  })

  describe('#sampleExtractionTubeJson', () => {
    it('will convert a deserialized response to the correct format for a pacbio request', () => {
      const tubes = new Response(Data.SampleExtractionTubesWithSample).deserialize.assets
      const [{ tube, sample, request }] = Actions.sampleExtractionTubeJson(tubes, undefined)
      // sample
      expect(sample.name).toBeDefined()
      expect(sample.species).toBeDefined()
      expect(sample.external_id).toBeDefined()
      expect(sample.external_id.includes('-')).toBeTruthy()
      // request
      expect(request.external_study_id).toBeDefined()
      expect(request.external_study_id.includes('-')).toBeTruthy()
      // tube
      expect(tube.barcode).toBeDefined()
    })
  })
})
