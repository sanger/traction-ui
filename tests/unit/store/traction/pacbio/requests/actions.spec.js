import Response from '@/api/Response'
import * as Actions from '@/store/traction/pacbio/requests/actions'
import { Data } from 'testHelper'

let requests, failedResponse

describe('actions', () => {
  beforeEach(() => {
    requests = new Response(Data.TractionPacbioSamples).deserialize.requests
    failedResponse = {
      status: 404,
      statusText: 'Record not found',
      data: { errors: { title: ['The record could not be found.'] } },
    }
  })

  describe('setRequests', () => {
    it('fetches the requets from the service, and commits them', async () => {
      const commit = jest.fn()
      const get = jest.fn()
      const getters = { requestsRequest: { get: get } }

      get.mockReturnValue(Data.TractionPacbioSamples)

      await Actions.setRequests({ commit, getters })

      expect(commit).toHaveBeenCalledWith('setRequests', requests)
    })
  })

  describe('updateRequest', () => {
    it('successful', async () => {
      let sample = requests[0]
      const update = jest.fn()
      const getters = { requestsRequest: { update: update }, requests: requests }

      update.mockReturnValue([Data.TractionPacbioSamples])

      let resp = await Actions.updateRequest({ getters }, sample)

      let expectedPayload = Actions.createRequestPayload(sample)
      expect(getters.requestsRequest.update).toHaveBeenCalledWith(expectedPayload)

      let expectedResp = new Response(Data.TractionPacbioSamples)
      expect(resp).toEqual(expectedResp)
    })

    it('unsuccessful', async () => {
      let sample = requests[0]
      const update = jest.fn()
      const getters = { requestsRequest: { update: update }, requests: requests }

      update.mockReturnValue([failedResponse])

      let expectedResponse = new Response(failedResponse)
      await expect(Actions.updateRequest({ getters }, sample)).rejects.toEqual(
        expectedResponse.errors,
      )
    })
  })

  describe('createRequestPayload', () => {
    it('creates the payload for the sample', async () => {
      let sample = new Response(Data.TractionPacbioSamples).deserialize.requests[0]
      let result = Actions.createRequestPayload(sample)

      expect(result.data.id).toEqual(sample.id)
      expect(result.data.type).toEqual('requests')
      expect(result.data.attributes.library_type).toEqual(sample.library_type)
      expect(result.data.attributes.estimate_of_gb_required).toEqual(sample.estimate_of_gb_required)
      expect(result.data.attributes.number_of_smrt_cells).toEqual(sample.number_of_smrt_cells)
      expect(result.data.attributes.cost_code).toEqual(sample.cost_code)
      expect(result.data.attributes.qc_status).toEqual(sample.qc_status)
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
      let expectedResponse = new Response(Data.CreatePacbioRequest)
      create.mockReturnValue(Data.CreatePacbioRequest)

      let response = await Actions.exportSampleExtractionTubesIntoTraction({ getters }, tubes)
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
      const [{ tube, sample, request }] = Actions.sampleExtractionTubeJson(tubes)
      // sample
      expect(sample.name).toBeDefined()
      expect(sample.species).toBeDefined()
      expect(sample.external_id).toBeDefined()
      expect(sample.external_id.includes('-')).toBeTruthy()
      // request
      expect(request.external_study_id).toBeDefined()
      expect(request.external_study_id.includes('-')).toBeTruthy()
      expect(request.library_type).toBeDefined()
      expect(request.estimate_of_gb_required).toBeDefined()
      expect(request.number_of_smrt_cells).toBeDefined()
      expect(request.cost_code).toBeDefined()
      // tube
      expect(tube.barcode).toBeDefined()
    })

    it('if cost code is null do not include cost code in request', () => {
      let tubes = new Response(Data.SampleExtractionTubesWithSample).deserialize.assets
      tubes[0].cost_code = null
      let [{ request }] = Actions.sampleExtractionTubeJson(tubes)
      expect(request.cost_code).not.toBeDefined()
    })
  })
})
