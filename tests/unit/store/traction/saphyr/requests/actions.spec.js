import Response from '@/api/Response'
import * as Actions from '@/store/traction/saphyr/requests/actions'
import { Data } from 'testHelper'

let requests

describe('actions', () => {
  beforeEach(() => {
    requests = new Response(Data.TractionSaphyrRequests).deserialize.requests
  })

  describe('setRequests', () => {
    it('fetches the requets from the service, and commits them', async () => {
      const commit = jest.fn()
      const get = jest.fn()
      const getters = { requestsRequest: { get: get } }

      get.mockReturnValue(Data.TractionSaphyrRequests)

      await Actions.setRequests({ commit, getters })

      expect(commit).toHaveBeenCalledWith('setRequests', requests)
    })
  })

  describe('#exportSampleExtractionTubesIntoTraction', () => {
    let dispatch, create, getters, tubes

    beforeEach(() => {
      create = jest.fn()
      getters = { requestsRequest: { create: create } }
      tubes = new Response(Data.SampleExtractionTubesWithSample).deserialize.assets
    })

    it('successfully', async () => {
      let expectedResponse = new Response(Data.TractionSaphyrTubesWithRequest)
      create.mockReturnValue(Data.TractionSaphyrTubesWithRequest)

      let response = await Actions.exportSampleExtractionTubesIntoTraction({ getters }, tubes)

      let sampleExtractionTubeJson = Actions.sampleExtractionTubeJson(tubes)

      let expectedPayload = {
        data: {
          data: {
            type: 'requests',
            attributes: {
              requests: sampleExtractionTubeJson,
            },
          },
        },
      }
      expect(create).toBeCalledWith(expectedPayload)
      expect(response).toEqual(expectedResponse)
    })

    it('unsuccessfully', async () => {
      let failedResponse = {
        status: 422,
        statusText: 'Unprocessable Entity',
        data: { errors: { name: ['error message'] } },
      }
      let expectedResponse = new Response(failedResponse)

      create.mockReturnValue(failedResponse)

      let response = await Actions.exportSampleExtractionTubesIntoTraction(
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
